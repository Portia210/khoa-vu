import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import {
  CrawlerCommand,
  CrawlerCommandZSchema,
  CrawlerStatus,
} from "src/shared/types/CrawlerCommand";
import { CrawlerJob } from "./schemas/crawler.job.schema";

@Injectable()
export class CrawlerJobService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(CrawlerJob.name)
    private readonly crawlerJobModel: Model<CrawlerJob>
  ) {}

  async updateJobStatus(
    job: CrawlerCommand,
    status: CrawlerStatus = "RUNNING",
    message?: string
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      let payload = {
        ...job,
        status,
        message,
      };
      payload._id = payload._id.toString();
      const { _id: id } = payload;
      const command = CrawlerCommandZSchema.parse(payload);
      const crawlerJob = await this.crawlerJobModel.findById(id);
      if (!crawlerJob) throw new BadRequestException("Job not found");
      await this.crawlerJobModel
        .findByIdAndUpdate(id.toString(), command, { session })
        .exec();
      await session.commitTransaction();
      return true;
    } catch (err: any) {
      await session.abortTransaction();
      throw new BadRequestException(err.message);
    }
  }
}
