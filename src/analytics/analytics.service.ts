import { Injectable } from "@nestjs/common";
import { HotelAggregateResult } from "./types/types";
import { filters } from "./utils/filers";
import { filterCompareResults } from "./utils/filterCompareResults";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BookingHotel } from "src/booking/schemas/booking.hotel.schema";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(BookingHotel.name)
    private bookingHotelModel: Model<BookingHotel>
  ) {}

  async analytics(
    bookingJobId: string,
    travelorJobId: string,
    currency: string = "USD"
  ) {
    const { results } = await this.compare(bookingJobId, travelorJobId);
    const filterResults = filterCompareResults(results);
    return {
      currency,
      ...filterResults,
      results,
    };
  }

  async compare(bookingJobId: string, travelorJobId: string) {
    const hotels: HotelAggregateResult[] = await this.bookingHotelModel
      .aggregate(filters(bookingJobId, travelorJobId))
      .sort({
        travelorPrice: -1,
      });
    const results = await this.filterResults(hotels);
    return {
      results,
      totalResults: results.length,
    };
  }

  private async filterResults(
    hotelResults: HotelAggregateResult[]
  ): Promise<any[]> {
    const results = await Promise.all(
      hotelResults.map(async (result) => {
        let { bookingCurrency, bookingPrice, travelorCurrency, travelorPrice } =
          result;
        const price_difference = Number(bookingPrice) - Number(travelorPrice);
        // Filter travelor hotels has better price
        if (price_difference < 0) return;
        return {
          ...result,
          bookingCurrency,
          travelorCurrency,
          bookingPrice: Math.round(Number(bookingPrice)),
          travelorPrice: Math.round(Number(travelorPrice)),
          price_difference: Math.round(price_difference),
        };
      })
    );
    return results.filter(Boolean);
  }
}
