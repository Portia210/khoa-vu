import { BadRequestException, Injectable, Logger } from "@nestjs/common";
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
import { CRAWLER_CONFIG } from "./config";
import { CRAWLER_STATUS } from "./constants";
import { CrawlerJob } from "./schemas/crawler.job.schema";
import { SessionInput } from "./schemas/session.input.schema";

const { VALUE, UNIT } = CRAWLER_CONFIG.CACHE_TIME;
@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

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
      this.logger.error("createSession", err);
      await mongooseSession.abortTransaction();
      throw err;
    }
  }

  async checkIfSessionExist(sessionInput: SessionInputDto): Promise<string> {
    const session = await this.sessionInputModel.findOne({
      ...sessionInput,
      createdAt: {
        $gt: dayjs().subtract(VALUE, UNIT).toDate(),
      },
    });
    return session?._id || null;
  }

  async getSessionInput(id: string) {
    const sessionInput = await this.sessionInputModel.findById(id).exec();
    if (!sessionInput) throw new BadRequestException("Session not found");
    return sessionInput;
  }

  async getJobsResult(bookingJobId: string, travelorJobId: string) {
    const [bookingJob, travelorJob] = await Promise.all([
      this.crawlerJobModel.findById(bookingJobId).exec(),
      this.crawlerJobModel.findById(travelorJobId).exec(),
    ]);

    if (!bookingJob || !travelorJob)
      throw new BadRequestException("Job not found");

    let status = CRAWLER_STATUS.RUNNING.valueOf();
    if (
      bookingJob.status === CRAWLER_STATUS.FINISHED.valueOf() &&
      travelorJob.status === CRAWLER_STATUS.FINISHED.valueOf()
    ) {
      status = bookingJob.status;
    } else if (
      bookingJob.status === CRAWLER_STATUS.FAILED.valueOf() ||
      travelorJob.status === CRAWLER_STATUS.FAILED.valueOf()
    ) {
      status = CRAWLER_STATUS.FAILED.valueOf();
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

  async getSessionResult(id: string) {
    const sessionInput = await this.getSessionInput(id);

    const isExpired = dayjs(sessionInput.createdAt).isBefore(
      dayjs().subtract(VALUE, UNIT)
    );

    const jobsResult = await this.getJobsResult(
      sessionInput.bookingJobId,
      sessionInput.travelorJobId
    );

    return {
      ...jobsResult,
      isExpired,
    };
  }

  /**
   * Get full travelor hotel result
   * @param id sessionid
   * @returns
   */
  async getFullTravelorResult(id: string) {
    const sessionInput = await this.getSessionInput(id);
    if (!sessionInput) throw new BadRequestException("Session not found");
    const isExpired = dayjs(sessionInput.createdAt).isBefore(
      dayjs().subtract(VALUE, UNIT)
    );
    let status = CRAWLER_STATUS.RUNNING.valueOf();

    const travelorJob = await this.crawlerJobModel
      .findById(sessionInput.travelorJobId)
      .exec();
    if (!travelorJob) throw new BadRequestException("Job not found");

    if (travelorJob.status === CRAWLER_STATUS.FINISHED.valueOf()) {
      status = travelorJob.status;
    } else if (travelorJob.status === CRAWLER_STATUS.FAILED.valueOf()) {
      status = CRAWLER_STATUS.FAILED.valueOf();
    }

    const results = await this.analyticsService.getTravelorHotels(
      sessionInput.travelorJobId
    );

    return {
      ...results,
      status,
      isExpired,
    };
  }

  async cleanUp(): Promise<number> {
    return (await this.connection.startSession()).withTransaction(
      async (session) => {
        let totalRemoved = 0;
        const oldSessions = await this.sessionInputModel
          .find({
            createdAt: { $lt: dayjs().subtract(VALUE, UNIT).toDate() },
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
    this.logger.log("Clean up old sessions");
    const total = await this.cleanUp();
    this.logger.log("Total removed", total);
  }
}
