import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";
import cloneDeep from "lodash/cloneDeep";
import mongoose, { Model } from "mongoose";
import { SessionInputDto } from "src/shared/types/SessionInput.dto";
import { TravelorCrawlerService } from "src/travelor/travelor.crawler.service";
import { BookingCrawlerService } from "../booking/booking.crawler.service";
import { AnalyticsService } from "src/analytics/analytics.service";
import { SessionInput } from "./schemas/session.input.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CrawlerJob } from "./schemas/crawler.job.schema";
import { BookingHotel } from "src/booking/schemas/booking.hotel.schema";
import { TravelorHotel } from "src/travelor/schemas/travelor.schema";

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(SessionInput.name)
    private sessionInputModel: Model<SessionInput>,
    @InjectModel(CrawlerJob.name) private crawlerJobModel: Model<CrawlerJob>,
    @InjectModel(BookingHotel.name)
    private bookingHotelModel: Model<BookingHotel>,
    @InjectModel(TravelorHotel.name)
    private travelorHotelModel: Model<TravelorHotel>,
    private readonly bookingCrawlerService: BookingCrawlerService,
    private readonly travelorCrawlerService: TravelorCrawlerService,
    private readonly analyticsService: AnalyticsService
  ) {}

  async createSession(sessionInput: SessionInputDto) {
    const mongooseSession = await mongoose.startSession();
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
      const sessionInputSearch = new SessionInput(data);
      const result = await sessionInputSearch.save({
        session: mongooseSession,
      });
      return {
        _id: result._id,
        bookingCommand: jobIds[0],
        travelorCommand: jobIds[1],
      };
    } catch (err) {
      console.error("createSession", err);
      await mongooseSession.abortTransaction();
      await mongooseSession.endSession(); // Close the session in case of an error
      throw err;
    } finally {
      await mongooseSession.commitTransaction();
      await mongooseSession.endSession(); // Close the session in any case
    }
  }

  async checkIfSessionExist(sessionInput: SessionInputDto): Promise<string> {
    const session = await this.sessionInputModel
      .findOne({
        ...sessionInput,
        createdAt: { $gt: dayjs().subtract(1, "day").toDate() },
      })
      .exec();
    return session?._id || null;
  }
  async getSessionResult(id: string) {
    const sessionInput = await this.sessionInputModel.findById(id).exec();
    if (!sessionInput) throw new Error("Session not found");

    const { bookingJobId, travelorJobId } = sessionInput;
    const [bookingJob, travelorJob] = await Promise.all([
      this.crawlerJobModel.findById(bookingJobId).exec(),
      this.crawlerJobModel.findById(travelorJobId).exec(),
    ]);

    if (!bookingJob || !travelorJob) throw new Error("Job not found");

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
    return (await mongoose.startSession()).withTransaction(async (session) => {
      let totalRemoved = 0;
      const oldSessions = await this.sessionInputModel
        .find({
          createdAt: { $lt: dayjs().subtract(1, "day").toDate() },
        })
        .session(session);

      if (!oldSessions.length) return totalRemoved;

      await Promise.all(
        oldSessions.map(async (oldSession) => {
          const bookingDeleteResult = await this.bookingHotelModel.deleteMany(
            { jobId: oldSession.bookingJobId },
            { session }
          );
          const travelorDeleteResult = await this.travelorHotelModel.deleteMany(
            { jobId: oldSession.travelorJobId },
            { session }
          );
          totalRemoved +=
            travelorDeleteResult.deletedCount +
            bookingDeleteResult.deletedCount;
        })
      );

      return totalRemoved;
    });
  }
}
