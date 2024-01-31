import { Injectable } from "@nestjs/common";
import { CrawlerCommand } from "src/shared/types/CrawlerCommand";
import { sleep } from "src/shared/utils/sleep";
import { TRAVELOR_API, TRAVERLOR_CONFIG } from "./constants";
import {
  TravelorHotelData,
  TravelorHotelResponse,
  TravelorHotelStatus,
} from "./types";
import { commandMapper } from "./utils/commandMapper";
import { dataMapping } from "./utils/dataMapping";
import fetch from "node-fetch";
import { userAgent } from "src/shared/constants";
import { ProxyService } from "src/proxy/proxy.service";
import { CrawlerJobService } from "src/session/crawler.job.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TravelorHotel as TravelorHotelModel } from "src/travelor/schemas/travelor.schema";

@Injectable()
export class TravelorService {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly crawlerJobService: CrawlerJobService,
    @InjectModel(TravelorHotelModel.name)
    private readonly travelorHotelModel: Model<TravelorHotelModel>
  ) {}

  async importHotels(command: CrawlerCommand) {
    console.log("importHotels travelor", command);
    try {
      const canContinue = await this.crawlerJobService.updateJobStatus(
        command,
        "RUNNING"
      );
      if (!canContinue) return;
      const commandMapped = commandMapper(command);
      const sessionId = await this.getSession(
        commandMapped,
        command.countryCode
      );
      await this.getTravelorHotels(command, sessionId);
      await this.onFinish(command);
    } catch (error) {
      console.error("error on importHotels", error);
      await this.crawlerJobService.updateJobStatus(command, "FAILED", error);
    }
  }
  private async syncData(
    command: CrawlerCommand,
    sessionId: string,
    hotels: TravelorHotelData[]
  ) {
    const dataMapped = dataMapping(command, sessionId, hotels);

    const bulkOps = dataMapped.map((hotel: any) => ({
      updateOne: {
        filter: {
          travelor_link: hotel?.travelor_link,
        },
        update: {
          $set: {
            ...hotel,
          },
        },
        upsert: true,
      },
    }));
    await this.travelorHotelModel.bulkWrite(bulkOps);
  }

  private async getSession(command: any, countryCode: string) {
    const response: any = await fetch(TRAVELOR_API.GET_SESSION, {
      method: "POST",
      agent: this.proxyService.getProxy(countryCode),
      headers: {
        "Content-Type": "application/json",
        accept: "application/json, text/plain, */*",
        authorization: TRAVERLOR_CONFIG.BEARER_TOKEN,
      },
      body: JSON.stringify(command),
    }).then((res) => res.json());
    return response.session;
  }

  private async getTravelorHotels(
    command: CrawlerCommand,
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
        locale: "en",
      });
    }
    const data = await this.getTravelorHotelData(
      command.countryCode,
      sessionId,
      params
    );
    const hotels = data.hotelsData;
    this.syncData(command, sessionId, hotels);
    const { totalResults, status } = await this.getResponseStatus(data);
    params = new URLSearchParams({
      sort_by: "distance",
      sort: "asc",
      currency: "USD",
      skip: "0",
      take: totalResults.toString(),
      locale: "en",
    });
    console.log("status", { totalResults, status });
    if (stop) return;
    if (status === "running") {
      await sleep(2000);
      return await this.getTravelorHotels(command, data.session, params);
    } else {
      return await this.getTravelorHotels(command, data.session, params, true);
    }
  }

  private async getTravelorHotelData(
    countryCode: string,
    sessionId: string,
    params: URLSearchParams
  ): Promise<TravelorHotelResponse> {
    const url = `${TRAVELOR_API.GET_HOTELS}/${sessionId}?${params.toString()}`;
    const response: any = await fetch(url, {
      agent: this.proxyService.getProxy(countryCode),
      headers: {
        "Content-Type": "application/json",
        accept: "application/json, text/plain, */*",
        "user-agent": userAgent,
        authorization: TRAVERLOR_CONFIG.BEARER_TOKEN,
      },
    }).then((res) => res.json());
    return {
      hotelsData: response?.data,
      session: response?.session,
      meta: response?.meta,
      status: response?.status,
    };
  }

  private async getResponseStatus(
    data: TravelorHotelResponse
  ): Promise<TravelorHotelStatus> {
    return {
      totalResults: data?.meta?.all?.total || 100,
      status: data.status || "finished",
    };
  }

  private async onFinish(command: any) {
    await this.crawlerJobService.updateJobStatus(command, "FINISHED");
  }
}
