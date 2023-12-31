import { TRAVELOR_API } from "../constants"

class TravelorCrawlerService {
  constructor() {}

  async importHotels(tabId: number) {
    console.log("importing hotels", tabId)
    const finishedCurrentState = true
    await this.getSession(tabId)
    return {
      finishedCurrentState
    }
  }

  private async getSession(tabId: number) {
    console.log("getting session")
    const body = {
      aggregator: "travolutionary",
      type: "geoloc",
      latitude: "48.856614",
      longitude: "2.3522219",
      radius: "50000",
      check_in: "2024-01-11",
      check_out: "2024-01-12",
      country: "VN",
      currency: "USD",
      net: 0,
      query_type: "destination",
      query_text: "Paris",
      guests: "a,a"
    }
    const session = await fetch(TRAVELOR_API.GET_SESSION, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json, text/plain, */*",
        authorization: "Bearer Nv2uH1uSSo2XCZratnQcBoUIrPkwrrMEQsCc4zz6"
      },
      body: JSON.stringify(body)
    })
    console.log("session:::", session)
    return session
  }

  private async getTotalResults(): Promise<number> {
    return 0
  }
}

const travelorCrawlerService = new TravelorCrawlerService()
export { travelorCrawlerService }
