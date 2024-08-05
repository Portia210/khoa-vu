import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import dayjs from "dayjs";
import { Model } from "mongoose";
import { AnalyticsService } from "src/analytics/analytics.service";
import { stringSimilarity } from "string-similarity-js";
import { CRAWLER_CONFIG } from "../config";
import { CRAWLER_STATUS } from "../constants";
import { CrawlerJob } from "../schemas/crawler.job.schema";
import { SessionService } from "../session.service";

const { VALUE, UNIT } = CRAWLER_CONFIG.CACHE_TIME;

@Injectable()
export class SessionServiceV2 {
  private readonly logger = new Logger(SessionServiceV2.name);

  constructor(
    private readonly sessionService: SessionService,
    private readonly analyticsService: AnalyticsService,
    @InjectModel(CrawlerJob.name)
    private readonly crawlerJobModel: Model<CrawlerJob>
  ) {}

  async getSessionResult(id: string) {
    const miniumSimilarityScore = 0.96;
    try {
      const sessionInput = await this.sessionService.getSessionInput(id);
      const isExpired = dayjs(sessionInput.createdAt).isBefore(
        dayjs().subtract(VALUE, UNIT)
      );
      const { bookingHotels, travelorHotels, status } =
        await this.getJobsResult(
          sessionInput.bookingJobId,
          sessionInput.travelorJobId
        );
      let calcResult = await this.calculateSimilarityScores(
        bookingHotels,
        travelorHotels,
        miniumSimilarityScore
      );

      const uniqueLinks = new Set();

      const uniqueHotels = calcResult.results.filter((hotel) => {
        if (!uniqueLinks.has(hotel.travelorLink)) {
          uniqueLinks.add(hotel.travelorLink);
          return true;
        }
        return false;
      });
      calcResult.results = await this.analyticsService.filterResultsV2(
        uniqueHotels
      );

      return {
        ...calcResult,
        totalResults: calcResult?.results?.length || 0,
        status,
        isExpired,
      };
    } catch (error) {
      this.logger.error(
        `error while getting session result ${JSON.stringify(error)}`
      );
      throw new BadRequestException(error.message);
    }
  }

  async getJobsResult(bookingJobId: string, travelorJobId: string) {
    const [bookingJob, travelorJob] = await Promise.all([
      this.crawlerJobModel.findById(bookingJobId).exec(),
      this.crawlerJobModel.findById(travelorJobId).exec(),
    ]);

    if (!bookingJob || !travelorJob)
      throw new BadRequestException("Job not found");

    const status = this.getJobStatus(bookingJob, travelorJob);

    const bookingHotelResults = await this.analyticsService.getBookingHotels(
      bookingJobId
    );
    const travelorHotelResults = await this.analyticsService.getTravelorHotels(
      travelorJobId
    );

    const bookingHotels = bookingHotelResults?.results;
    const travelorHotels = travelorHotelResults?.results;

    return { bookingHotels, travelorHotels, status };
  }

  private async calculateSimilarityScores(
    bookingHotels: any[],
    travelorHotels: any[],
    requiredScore: number
  ) {
    const results = [];

    if (bookingHotels && travelorHotels) {
      bookingHotels.forEach((bookingHotel) => {
        travelorHotels.forEach((travelorHotel) => {
          const similarityScore = stringSimilarity(
            bookingHotel?.title,
            travelorHotel?.title
          );
          if (similarityScore > requiredScore && similarityScore < 1) {
            results.push({
              ...bookingHotel,
              ...travelorHotel,
              bookingTitle: bookingHotel?.title,
              travelorTitle: travelorHotel?.title,
              similarityScore,
            });
          } else if (similarityScore >= requiredScore) {
            results.push({
              ...bookingHotel,
              ...travelorHotel,
              bookingTitle: bookingHotel?.title,
              travelorTitle: travelorHotel?.title,
              similarityScore,
            });
          }
        });
      });
    }
    return {
      results,
    };
  }

  private getJobStatus(bookingJob: CrawlerJob, travelorJob: CrawlerJob) {
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
    return status;
  }
}
