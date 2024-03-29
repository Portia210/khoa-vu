import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  CrawlerJob,
  CrawlerJobSchema,
} from "src/session/schemas/crawler.job.schema";
import { TravelorController } from "./travelor.controller";
import { TravelorCrawlerService } from "./travelor.crawler.service";
import { TravelorService } from "./travelor.service";
import { TravelorHotel, TravelorHotelSchema } from "./schemas/travelor.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CrawlerJob.name, schema: CrawlerJobSchema },
      { name: TravelorHotel.name, schema: TravelorHotelSchema },
    ]),
  ],
  controllers: [TravelorController],
  providers: [TravelorService, TravelorCrawlerService],
  exports: [TravelorCrawlerService, TravelorService],
})
export class TravelorModule {}
