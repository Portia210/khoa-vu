import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import dayjs from "dayjs";
import cloneDeep from "lodash/cloneDeep";
import mongoose, { Model } from "mongoose";
import { AnalyticsService } from "src/analytics/analytics.service";
import { BookingHotel } from "src/booking/schemas/booking.hotel.schema";
import { SessionInputDto } from "src/shared/types/SessionInput.dto";
import { TravelorHotel } from "src/travelor/schemas/travelor.schema";
import { TravelorCrawlerService } from "src/travelor/travelor.crawler.service";
import { BookingCrawlerService } from "../booking/booking.crawler.service";
import { CrawlerJob } from "./schemas/crawler.job.schema";
import { SessionInput } from "./schemas/session.input.schema";

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(SessionInput.name)
    private readonly sessionInputModel: Model<SessionInput>,
    @InjectModel(CrawlerJob.name)
    private readonly crawlerJobModel: Model<CrawlerJob>,
    @InjectModel(BookingHotel.name)
    private readonly bookingHotelModel: Model<BookingHotel>,
    @InjectModel(TravelorHotel.name)
    private readonly travelorHotelModel: Model<TravelorHotel>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly bookingCrawlerService: BookingCrawlerService,
    private readonly travelorCrawlerService: TravelorCrawlerService,
    private readonly analyticsService: AnalyticsService
  ) {}

  async createSession(sessionInput: SessionInputDto) {
    const mongooseSession = await this.connection.startSession();
    mongooseSession.startTransaction();

    try {
      const jobIds = await Promise.all([
        this.bookingCrawlerService.createCommand(sessionInput, mongooseSession),
        this.travelorCrawlerService.createCommand(
          sessionInput,
          mongooseSession
        ),
      ]);
      let data: any = cloneDeep(sessionInput);
      data.bookingJobId = jobIds[0]._id;
      data.travelorJobId = jobIds[1]._id;

      const sessionInputSearch = new this.sessionInputModel(data);
      const result = await sessionInputSearch.save({
        session: mongooseSession,
      });

      await mongooseSession.commitTransaction();

      return {
        _id: result._id,
        bookingCommand: jobIds[0],
        travelorCommand: jobIds[1],
      };
    } catch (err) {
      console.error("createSession", err);
      await mongooseSession.abortTransaction();
      throw err;
    }
  }

  async checkIfSessionExist(sessionInput: SessionInputDto): Promise<string> {
    const session = await this.sessionInputModel.findOne({
      ...sessionInput,
      createdAt: { $gt: dayjs().subtract(10, "minute").toDate() },
    });
    return session?._id || null;
  }

  async getSessionResult(id: string) {
    const sessionInput = await this.sessionInputModel.findById(id).exec();
    if (!sessionInput) throw new BadRequestException("Session not found");

    const { bookingJobId, travelorJobId } = sessionInput;
    const [bookingJob, travelorJob] = await Promise.all([
      this.crawlerJobModel.findById(bookingJobId).exec(),
      this.crawlerJobModel.findById(travelorJobId).exec(),
    ]);

    if (!bookingJob || !travelorJob)
      throw new BadRequestException("Job not found");

    let status = "RUNNING";
    if (bookingJob.status === "FINISHED" && travelorJob.status === "FINISHED") {
      status = bookingJob.status;
    } else if (
      bookingJob.status === "FAILED" ||
      travelorJob.status === "FAILED"
    ) {
      status = "FAILED";
    }

    const analytics = await this.analyticsService.compare(
      bookingJobId,
      travelorJobId
    );

    return {
      ...analytics,
      status,
    };
  }

  async cleanUp(): Promise<number> {
    return (await this.connection.startSession()).withTransaction(
      async (session) => {
        let totalRemoved = 0;
        const oldSessions = await this.sessionInputModel
          .find({
            createdAt: { $lt: dayjs().subtract(10, "minute").toDate() },
          })
          .session(session);

        if (!oldSessions.length) return totalRemoved;

        await Promise.all(
          oldSessions.map(async (oldSession) => {
            const bookingDeleteResult = await this.bookingHotelModel.deleteMany(
              { jobId: oldSession.bookingJobId },
              { session }
            );
            const travelorDeleteResult =
              await this.travelorHotelModel.deleteMany(
                { jobId: oldSession.travelorJobId },
                { session }
              );
            totalRemoved +=
              travelorDeleteResult.deletedCount +
              bookingDeleteResult.deletedCount;
          })
        );
        return totalRemoved;
      }
    );
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    console.log("Clean up old sessions");
    const total = await this.cleanUp();
    console.log("Total removed", total);
  }
}
