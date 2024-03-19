import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AnalyticsModule } from "src/analytics/analytics.module";
import { BookingModule } from "src/booking/booking.module";
import {
  BookingHotel,
  BookingHotelSchema,
} from "src/booking/schemas/booking.hotel.schema";
import {
  TravelorHotel,
  TravelorHotelSchema,
} from "src/travelor/schemas/travelor.schema";
import { TravelorModule } from "src/travelor/travelor.module";
import { CrawlerJob, CrawlerJobSchema } from "./schemas/crawler.job.schema";

import {
  SessionInput,
  SessionInputSchema,
} from "./schemas/session.input.schema";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";
import { SessionControllerV2 } from "./v2/session.controller";
import { SessionServiceV2 } from "./v2/session.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SessionInput.name, schema: SessionInputSchema },
      { name: CrawlerJob.name, schema: CrawlerJobSchema },
      { name: BookingHotel.name, schema: BookingHotelSchema },
      { name: TravelorHotel.name, schema: TravelorHotelSchema },
    ]),
    TravelorModule,
    BookingModule,
    AnalyticsModule,
  ],
  controllers: [SessionController, SessionControllerV2],
  providers: [SessionService, SessionServiceV2],
})
export class SessionModule {}
