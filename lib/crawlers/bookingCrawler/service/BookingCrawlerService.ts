import axios from "axios"

import { updateJobStatus } from "~lib/framework/utils/updateJobStatus"
import type { CrawlerCommand } from "~lib/shared/types/CrawlerCommand"

import { BOOKING_API } from "../constants"
import { graphqlQuery } from "../constants/api"
import type {
  BookingHotelResponse,
  BookingHotelResult
} from "../types/booking.hotel.response"
import { commandMapper } from "../utils/commandMapper"
import { dataMapping } from "../utils/dataMapping"

class BookingCrawlerService {
  constructor() {}

  async importHotels(command: CrawlerCommand): Promise<any> {
    await updateJobStatus(command, "RUNNING")
    const commandMapped = commandMapper(command)
    const hotelResults = await this.getBookingHotels(commandMapped)
    await this.onFinish(command, hotelResults)
    return {
      finishedCurrentState: true
    }
  }

  private async getBookingHotels(variables: any) {
    const results = []
    const resultLimit = 1000
    let pagination
    let paginationInput = {
      offset: 0,
      rowsPerPage: 100
    }

    const fetchBookingHotels = async (payload: any) => {
      const url = `${BOOKING_API.GRAPHQL}?selected_currency="USD"`
      const response: BookingHotelResponse = await axios
        .post(url, JSON.stringify(payload), {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then((res) => res.data.data)

      results.push(response?.searchQueries?.search?.results || [])
      return response.searchQueries.search.pagination
    }

    do {
      variables.input.pagination = paginationInput
      const payload = {
        query: graphqlQuery,
        variables
      }
      pagination = await fetchBookingHotels(payload)
      paginationInput.offset += paginationInput.rowsPerPage
    } while (
      paginationInput.offset < pagination.nbResultsTotal &&
      paginationInput.offset < resultLimit
    )

    return results.flat()
  }

  private async onFinish(
    command: CrawlerCommand,
    hotelResults: BookingHotelResult[]
  ) {
    const hotelFiltered = dataMapping(command, hotelResults)
    await Promise.allSettled([
      fetch(BOOKING_API.SYNC_URL, {
        method: "POST",
        body: JSON.stringify(hotelFiltered),
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => res.json()),
      updateJobStatus(command, "FINISHED")
    ]).catch((err) => {
      console.error("error on onFinish", err)
    })
  }
}

const bookingCrawlerService = new BookingCrawlerService()
export { bookingCrawlerService }
