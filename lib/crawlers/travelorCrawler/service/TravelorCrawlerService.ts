import { sleep } from "~utils/sleep"

import { TRAVELOR_API, TRAVERLOR_CONFIG } from "../constants"
import type {
  TravelorHotelData,
  TravelorHotelResponse,
  TravelorHotelStatus
} from "../types"
import { dataMapping } from "../utils/dataMapping"

class TravelorCrawlerService {
  params = new URLSearchParams({
    sort_by: "distance",
    sort: "asc",
    currency: "USD",
    skip: "0",
    take: "100",
    locale: "en"
  })

  constructor() {}

  async importHotels(tabId: number) {
    const sessionId = await this.getSession(tabId)
    const data = await this.getTravelorHotels(sessionId)
    await this.onFinish(data)
    return {
      finishedCurrentState: true
    }
  }

  private async onFinish(hotels: TravelorHotelData[]) {
    const dataMapped = dataMapping(hotels)
    const sync = await fetch(TRAVELOR_API.SYNC_URL, {
      method: "POST",
      body: JSON.stringify(dataMapped),
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res) => res.json())
    console.log("sync result:::", sync)
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
      check_out: "2024-01-31",
      country: "VN",
      currency: "USD",
      net: 0,
      query_type: "destination",
      query_text: "Paris",
      guests: "a,a"
    }
    const response = await fetch(TRAVELOR_API.GET_SESSION, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json, text/plain, */*",
        authorization: TRAVERLOR_CONFIG.BEARER_TOKEN
      },
      body: JSON.stringify(body)
    }).then((res) => res.json())
    console.log("session:::", response)
    return response.session
  }

  private async getTravelorHotels(
    sessionId: string,
    params?: URLSearchParams
  ): Promise<TravelorHotelData[]> {
    if (!params) {
      params = new URLSearchParams({
        sort_by: "distance",
        sort: "asc",
        currency: "USD",
        skip: "0",
        take: "100",
        locale: "en"
      })
    }
    const data = await this.getTravelorHotelData(sessionId, params)
    const { totalResults, status } = await this.getResponseStatus(data)
    if (status === "running") {
      await sleep(1500)
      const params = new URLSearchParams({
        sort_by: "distance",
        sort: "asc",
        currency: "USD",
        skip: "0",
        take: totalResults.toString(),
        locale: "en"
      })
      return await this.getTravelorHotels(sessionId, params)
    }
    return data.hotelsData
  }

  private async getTravelorHotelData(
    sessionId: string,
    params: URLSearchParams
  ): Promise<TravelorHotelResponse> {
    const url = `${TRAVELOR_API.GET_HOTELS}/${sessionId}?${params.toString()}`
    const response = await fetch(url, {
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json, text/plain, */*",
        authorization: TRAVERLOR_CONFIG.BEARER_TOKEN
      }
    }).then((res) => res.json())
    return {
      hotelsData: response?.data,
      session: response?.session,
      meta: response?.meta,
      status: response?.status
    }
  }

  private async getResponseStatus(
    data: TravelorHotelResponse
  ): Promise<TravelorHotelStatus> {
    return {
      totalResults: data?.meta?.all?.total || 100,
      status: data.status || "finished"
    }
  }
}

const travelorCrawlerService = new TravelorCrawlerService()
export { travelorCrawlerService }
