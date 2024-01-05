import axios from "axios"

import { BOOKING_API } from "../constants"
import { defaultGraphqlVariablesInput, graphqlQuery } from "../constants/api"
import type { BookingHotelResponse } from "../types/booking.hotel.response"
import { filterBookingHotel } from "../utils/filterBookingHotel"

class BookingCrawlerService {
  constructor() {}

  async importHotels(): Promise<any> {
    await this.getBookingHotels()
    await this.onFinish()
    return {
      finishedCurrentState: true
    }
  }

  private async getBookingHotels() {
    const variables = defaultGraphqlVariablesInput
    const payload = JSON.stringify({
      query: graphqlQuery,
      variables
    })
    const response: BookingHotelResponse = await axios
      .post(BOOKING_API.GRAPHQL, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((res) => res.data.data)
    const hotelResults = response?.searchQueries.search.results
    const hotelFiltered = filterBookingHotel(hotelResults)
    console.log("hotelFiltered --->", hotelFiltered)
  }

  private async onFinish() {
    console.log("onFinish")
  }
}

const bookingCrawlerService = new BookingCrawlerService()
export { bookingCrawlerService }
