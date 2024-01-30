import { Module } from "@nestjs/common";
import { ProxyModule } from "src/proxy/proxy.module";
import { TravelorController } from "./travelor.controller";
import { TravelorService } from "./travelor.service";
import { TravelorCrawlerService } from "./travelor.crawler.service";
import { MongooseModule } from "@nestjs/mongoose";
import {
  CrawlerJob,
  CrawlerJobSchema,
} from "src/session/schemas/crawler.job.schema";

@Module({
  imports: [
    ProxyModule,
    MongooseModule.forFeature([
      { name: CrawlerJob.name, schema: CrawlerJobSchema },
    ]),
  ],
  controllers: [TravelorController],
  providers: [TravelorService, TravelorCrawlerService],
  exports: [TravelorCrawlerService, TravelorService],
})
export class TravelorModule {}
