import axios from "axios"

import { BOOKING_API } from "../constants"
import { defaultGraphqlVariablesInput, graphqlQuery } from "../constants/api"
import type {
  BookingHotelResponse,
  BookingHotelResult
} from "../types/booking.hotel.response"
import { dataMapping } from "../utils/dataMapping"

class BookingCrawlerService {
  constructor() {}

  async importHotels(): Promise<any> {
    const hotelResults = await this.getBookingHotels()
    await this.onFinish(hotelResults)
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
    return response?.searchQueries.search.results
  }

  private async onFinish(hotelResults: BookingHotelResult[]) {
    const hotelFiltered = dataMapping(hotelResults)
    await Promise.allSettled([
      fetch(BOOKING_API.SYNC_URL, {
        method: "POST",
        body: JSON.stringify(hotelFiltered),
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => res.json())
      // updateJobStatus(command, "FINISHED")
    ]).catch((err) => {
      console.error("error on onFinish", err)
    })
  }
}

const bookingCrawlerService = new BookingCrawlerService()
export { bookingCrawlerService }
