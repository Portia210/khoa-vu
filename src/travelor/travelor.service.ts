import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { cloneDeep } from "lodash";
import { Model } from "mongoose";
import fetch from "node-fetch";
import { ProxyService } from "src/proxy/proxy.service";
import { CRAWLER_STATUS } from "src/session/constants";
import { CrawlerJobService } from "src/session/crawler.job.service";
import { userAgent } from "src/shared/constants";
import { CrawlerCommand } from "src/shared/types/CrawlerCommand";
import { sleep } from "src/shared/utils/sleep";
import { TravelorHotel as TravelorHotelModel } from "src/travelor/schemas/travelor.schema";
import { TRAVELOR_API, TRAVERLOR_CONFIG } from "./constants";
import {
  TravelorHotelData,
  TravelorHotelResponse,
  TravelorHotelStatus,
  TravelorSearchQuery,
} from "./types";
import { commandMapper } from "./utils/commandMapper";
import { dataMapping } from "./utils/dataMapping";

@Injectable()
export class TravelorService {
  private readonly logger = new Logger(TravelorService.name);

  constructor(
    private readonly proxyService: ProxyService,
    private readonly crawlerJobService: CrawlerJobService,
    @InjectModel(TravelorHotelModel.name)
    private readonly travelorHotelModel: Model<TravelorHotelModel>
  ) {}

  async importHotels(command: CrawlerCommand) {
    this.logger.log("importHotels travelor", command);
    try {
      const canContinue = await this.crawlerJobService.updateJobStatus(
        command,
        CRAWLER_STATUS.RUNNING
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
      this.logger.error("error on importHotels", error);
      await this.crawlerJobService.updateJobStatus(
        command,
        CRAWLER_STATUS.FAILED,
        error
      );
    }
  }
  private async syncData(
    command: CrawlerCommand,
    sessionId: string,
    hotels: TravelorHotelData[],
    travelorSearchQuery: TravelorSearchQuery
  ) {
    const dataMapped = dataMapping(
      command,
      sessionId,
      hotels,
      travelorSearchQuery
    );

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
    const payload = cloneDeep(command);
    payload.country = payload.country.toUpperCase();
    const response: any = await fetch(TRAVELOR_API.GET_SESSION, {
      method: "POST",
      agent: this.proxyService.getProxy(countryCode),
      headers: {
        "Content-Type": "application/json",
        accept: "application/json, text/plain, */*",
        authorization: TRAVERLOR_CONFIG.BEARER_TOKEN,
      },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      if (res.ok) return await res.json();
      this.logger.log("getSession error", res);
    });
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
        currency: "ILS",
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
    this.syncData(command, sessionId, hotels, data.search);
    const { totalResults, status } = this.getResponseStatus(data);
    params = new URLSearchParams({
      sort_by: "distance",
      sort: "asc",
      currency: "ILS",
      skip: "0",
      take: totalResults.toString(),
      locale: "en",
    });
    this.logger.log("status", { totalResults, status });
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
      search: response?.search,
      session: response?.session,
      meta: response?.meta,
      status: response?.status,
    };
  }

  private getResponseStatus(data: TravelorHotelResponse): TravelorHotelStatus {
    return {
      totalResults: data?.meta?.all?.total || 100,
      status: data.status || "finished",
    };
  }

  private async onFinish(command: any) {
    await this.crawlerJobService.updateJobStatus(
      command,
      CRAWLER_STATUS.FINISHED
    );
  }
}
