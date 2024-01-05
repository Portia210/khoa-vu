import axios from "axios"

import { BOOKING_API } from "../constants"
import { defaultGraphqlVariablesInput, graphqlQuery } from "../constants/api"

class BookingCrawlerService {
  constructor() {}

  async importHotels(): Promise<any> {
    const variables = defaultGraphqlVariablesInput
    const payload = JSON.stringify({
      query: graphqlQuery,
      variables
    })
    const response = await axios
      .post(BOOKING_API.GRAPHQL, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((res) => res.data)
    console.log("response --->", response)
    return {
      finishedCurrentState: true
    }
  }
}

const bookingCrawlerService = new BookingCrawlerService()
export { bookingCrawlerService }
