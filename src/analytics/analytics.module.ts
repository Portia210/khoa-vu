import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  BookingHotel,
  BookingHotelSchema,
} from "src/booking/schemas/booking.hotel.schema";
import { TravelorHotel, TravelorHotelSchema } from "src/travelor/schemas/travelor.schema";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookingHotel.name, schema: BookingHotelSchema },
      { name: TravelorHotel.name, schema: TravelorHotelSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
