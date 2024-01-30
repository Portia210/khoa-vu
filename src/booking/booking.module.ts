import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { ProxyModule } from "src/proxy/proxy.module";
import { BookingCrawlerService } from "./booking.crawler.service";

@Module({
  imports: [ProxyModule],
  controllers: [BookingController],
  providers: [BookingService, BookingCrawlerService],
  exports: [BookingCrawlerService],
})
export class BookingModule {}
