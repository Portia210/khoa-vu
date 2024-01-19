import { updateJobStatus } from "~lib/framework/utils/updateJobStatus"
import type { CrawlerCommand } from "~lib/shared/types/CrawlerCommand"
import { sleep } from "~utils/sleep"

import { TRAVELOR_API, TRAVERLOR_CONFIG } from "../constants"
import type {
  TravelorHotelData,
  TravelorHotelResponse,
  TravelorHotelStatus
} from "../types"
import { commandMapper } from "../utils/commandMapper"
import { dataMapping } from "../utils/dataMapping"

export class TravelorCrawlerService {
  constructor() {}

  async importHotels(command: CrawlerCommand) {
    try {
      await updateJobStatus(command, "RUNNING")
      const commandMapped = commandMapper(command)
      const sessionId = await this.getSession(commandMapped)
      await this.getTravelorHotels(command, sessionId)
      await this.onFinish(command)
    } catch (error) {
      console.error("error on importHotels", error)
      await updateJobStatus(command, "FAILED", error)
    }
  }
  private async syncData(
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
      }).then((res) => res.json())
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
    command: any,
    sessionId: string,
    params?: URLSearchParams,
    stop = false
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
    const hotels = data.hotelsData
    this.syncData(command, sessionId, hotels)
    const { totalResults, status } = await this.getResponseStatus(data)
    params = new URLSearchParams({
      sort_by: "distance",
      sort: "asc",
      currency: "USD",
      skip: "0",
      take: totalResults.toString(),
      locale: "en"
    })
    if (stop) return
    if (status === "running") {
      await sleep(2000)
      return await this.getTravelorHotels(command, data.session, params)
    } else {
      return await this.getTravelorHotels(command, data.session, params, true)
    }
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

  private async onFinish(command: any) {
    updateJobStatus(command, "FINISHED")
  }
}
