import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import { ClientSession, Model } from "mongoose";
import { DATA_SOURCES } from "src/shared/constants/dataSources";
import { CrawlerCommandZSchema } from "src/shared/types/CrawlerCommand";
import { SessionInputDto } from "src/shared/types/SessionInput.dto";
import { autoSelectPlace } from "./utils/bookingAutoComplete/bookingAutoComplete";
import { InjectModel } from "@nestjs/mongoose";
import { CrawlerJob } from "src/session/schemas/crawler.job.schema";

@Injectable()
export class BookingCrawlerService {
  constructor(
    @InjectModel(CrawlerJob.name) private crawlerJobModel: Model<CrawlerJob>
  ) {}

  /**
   *
   * @param sessionInput
   * @returns CrawlerJob
   */
  async createCommand(input: SessionInputDto, session?: ClientSession) {
    const sessionInput = cloneDeep(input);
    if (!sessionInput?.destination?.dest_type) {
      sessionInput.destination = await autoSelectPlace(
        sessionInput?.destination?.destination
      );
    }
    const command = CrawlerCommandZSchema.parse(sessionInput);
    command.dataSource = DATA_SOURCES.BOOKING;
    const crawlerJob = new this.crawlerJobModel(command);
    const result = await crawlerJob.save({ session });
    return result;
  }
}
