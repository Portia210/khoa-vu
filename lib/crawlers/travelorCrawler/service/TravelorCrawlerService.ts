import { updateJobStatus } from "~lib/framework/utils/updateJobStatus"
import { sleep } from "~utils/sleep"

import { TRAVELOR_API, TRAVERLOR_CONFIG } from "../constants"
import type {
  TravelorHotelData,
  TravelorHotelResponse,
  TravelorHotelStatus
} from "../types"
import { commandMapper } from "../utils/commandMapper"
import { dataMapping } from "../utils/dataMapping"
import type { CrawlerCommand } from "~lib/shared/types/CrawlerCommand"

class TravelorCrawlerService {
  constructor() {}

  async importHotels(command: CrawlerCommand) {
    await updateJobStatus(command, "RUNNING")
    const commandMapped = commandMapper(command)
    const sessionId = await this.getSession(commandMapped)
    const data = await this.getTravelorHotels(sessionId)
    await this.onFinish(command, sessionId, data)
    return {
      finishedCurrentState: true
    }
  }

  private async onFinish(
    command: any,
    sessionId: string,
    hotels: TravelorHotelData[]
  ) {
    const dataMapped = dataMapping(command, sessionId, hotels)
    await Promise.allSettled([
      fetch(TRAVELOR_API.SYNC_URL, {
        method: "POST",
        body: JSON.stringify(dataMapped),
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => res.json()),
      updateJobStatus(command, "FINISHED")
    ]).catch((err) => {
      console.error("error on onFinish", err)
    })
  }

  private async getSession(command: any) {
    const response = await fetch(TRAVELOR_API.GET_SESSION, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json, text/plain, */*",
        authorization: TRAVERLOR_CONFIG.BEARER_TOKEN
      },
      body: JSON.stringify(command)
    }).then((res) => res.json())
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
        take: "48",
        locale: "en"
      })
    }
    const data = await this.getTravelorHotelData(sessionId, params)
    const { totalResults, status } = await this.getResponseStatus(data)
    if (status === "running") {
      await sleep(2000)
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
