import { Injectable } from "@nestjs/common";
import fetch from "node-fetch";
import { ProxyService } from "src/proxy/proxy.service";
import { userAgent } from "src/shared/constants";
import { CrawlerCommand } from "src/shared/types/CrawlerCommand";
import { updateJobStatus } from "src/shared/utils/updateJobStatus";
import { BOOKING_API } from "./constants";
import { graphqlQuery } from "./constants/api";
import {
  BookingHotelResponse,
  BookingHotelResult,
} from "./types/booking.hotel.response";
import { commandMapper } from "./utils/commandMapper";
import { dataMapping } from "./utils/dataMapping";

@Injectable()
export class BookingService {
  constructor(private readonly proxyService: ProxyService) {}

  async importHotels(command: CrawlerCommand): Promise<any> {
    console.log("importHotels booking", command);
    try {
      const canContinue = await updateJobStatus(command, "RUNNING");
      if (!canContinue) return;
      const commandMapped = commandMapper(command);
      await this.getBookingHotels(command, commandMapped);
      await this.onFinish(command);
    } catch (error) {
      console.error("error on importHotels", error);
      await updateJobStatus(command, "FAILED", JSON.stringify(error));
    }
  }

  private async getBookingHotels(command: CrawlerCommand, variables: any) {
    const resultLimit = 1000;
    let pagination = null;
    const paginationInput = {
      offset: 0,
      rowsPerPage: 100,
    };

    const fetchBookingHotels = async (payload: any) => {
      const url = `${BOOKING_API.GRAPHQL}?selected_currency=USD`;
      const response: BookingHotelResponse = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        agent: this.proxyService.getProxy(command.countryCode),
        headers: {
          "Content-Type": "application/json",
          "user-agent": userAgent,
          authority: "www.booking.com",
          accept: "*/*",
        },
      }).then(async (res) => {
        return await res.json().then((res: any) => res.data);
      });
      const results = response?.searchQueries?.search?.results || [];
      const hotelResults = results.flat();
      pagination = response?.searchQueries?.search?.pagination;
      if (!pagination) {
        return await fetchBookingHotels(payload);
      } else {
        this.syncData(command, hotelResults);
      }
      return pagination;
    };

    do {
      variables.input.pagination = paginationInput;
      const payload = {
        query: graphqlQuery,
        variables,
      };
      pagination = await fetchBookingHotels(payload);
      paginationInput.offset += paginationInput.rowsPerPage;
    } while (
      paginationInput.offset < pagination.nbResultsTotal &&
      paginationInput.offset < resultLimit
    );
  }

  private async syncData(
    command: CrawlerCommand,
    hotelResults: BookingHotelResult[]
  ) {
    const hotelFiltered = dataMapping(command, hotelResults);
    await Promise.allSettled([
      fetch(BOOKING_API.SYNC_URL, {
        method: "POST",
        body: JSON.stringify(hotelFiltered),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    ]);
  }

  private async onFinish(command: CrawlerCommand) {
    updateJobStatus(command, "FINISHED");
  }
}
