import { Global, Module } from "@nestjs/common";
import { CrawlerJobService } from "./crawler.job.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CrawlerJob, CrawlerJobSchema } from "./schemas/crawler.job.schema";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CrawlerJob.name, schema: CrawlerJobSchema },
    ]),
  ],
  providers: [CrawlerJobService],
  exports: [CrawlerJobService],
})
export class CrawlerJobModule {}
