import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import { ClientSession } from "mongoose";
import CrawlerJob from "src/session/schemas/crawler.job.schema";
import { DATA_SOURCES } from "src/shared/constants/dataSources";
import { CrawlerCommandZSchema } from "src/shared/types/CrawlerCommand";
import { SessionInputDto } from "src/shared/types/SessionInput.dto";

@Injectable()
export class TravelorCrawlerService {
  /**
   *
   * @param sessionInput
   * @returns CrawlerJob
   */
  async createCommand(input: SessionInputDto, session?: ClientSession) {
    const sessionInput = cloneDeep(input);
    const command = CrawlerCommandZSchema.parse(sessionInput);
    command.dataSource = DATA_SOURCES.TRAVELOR;
    const crawlerJob = new CrawlerJob(command);
    const result = await crawlerJob.save({ session });
    return result;
  }
}
