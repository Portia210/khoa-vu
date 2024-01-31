import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  CrawlerJob,
  CrawlerJobSchema,
} from "src/session/schemas/crawler.job.schema";
import { BookingController } from "./booking.controller";
import { BookingCrawlerService } from "./booking.crawler.service";
import { BookingService } from "./booking.service";
import {
  BookingHotel,
  BookingHotelSchema,
} from "./schemas/booking.hotel.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookingHotel.name, schema: BookingHotelSchema },
      { name: CrawlerJob.name, schema: CrawlerJobSchema },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingCrawlerService],
  exports: [BookingCrawlerService, BookingService],
})
export class BookingModule {}
