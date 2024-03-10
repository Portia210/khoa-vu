import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import fetch from "node-fetch";
import { ProxyService } from "src/proxy/proxy.service";
import { DEFAULT_COUNTRY, ProxyType } from "src/proxy/types";
import { CRAWLER_STATUS } from "src/session/constants";
import { CrawlerJobService } from "src/session/crawler.job.service";
import { userAgent } from "src/shared/constants";
import { CrawlerCommand } from "src/shared/types/CrawlerCommand";
import { BOOKING_API } from "./constants";
import { graphqlQuery } from "./constants/api";
import { BookingHotel } from "./schemas/booking.hotel.schema";
import {
  BookingHotelResponse,
  BookingHotelResult,
} from "./types/booking.hotel.response";
import { commandMapper } from "./utils/commandMapper";
import { dataMapping } from "./utils/dataMapping";

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly proxyService: ProxyService,
    private readonly crawlerJobService: CrawlerJobService,
    @InjectModel(BookingHotel.name)
    private readonly bookingHotelModel: Model<BookingHotel>
  ) {}

  async importHotels(command: CrawlerCommand): Promise<any> {
    this.logger.log("importHotels booking", command);
    try {
      const canContinue = await this.crawlerJobService.updateJobStatus(
        command,
        CRAWLER_STATUS.RUNNING
      );
      if (!canContinue) return;
      const commandMapped = commandMapper(command);
      await this.getBookingHotels(command, commandMapped);
      await this.onFinish(command);
    } catch (error) {
      this.logger.error("error on importHotels", error);
      await this.crawlerJobService.updateJobStatus(
        command,
        CRAWLER_STATUS.FAILED,
        JSON.stringify(error)
      );
    }
  }

  private async getBookingHotels(command: CrawlerCommand, variables: any) {
    const resultLimit = 1000;
    let pagination = null;
    const paginationInput = {
      offset: 0,
      rowsPerPage: 100,
    };

    const fetchBookingHotels = async (
      payload: any,
      agent: any,
      retryCount = 0
    ) => {
      const url = `${BOOKING_API.GRAPHQL}?selected_currency=USD`;
      const response: BookingHotelResponse = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        agent,
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
          "user-agent": userAgent,
          "Cache-Control": "no-cache",
          accept: "application/json, text/plain, */*",
        },
      }).then(async (res) => {
        if (res.ok) return await res.json().then((res: any) => res.data);
        this.logger.error("fetchBookingHotels error", {
          status: res.status,
          statusText: res.statusText,
          url: res.url,
        });
        return [];
      });
      const results = response?.searchQueries?.search?.results || [];
      const hotelResults = results.flat();
      this.logger.log("hotelResults", hotelResults.length);
      pagination = response?.searchQueries?.search?.pagination;
      if (!pagination) {
        if (retryCount < 2) {
          return await fetchBookingHotels(payload, agent, retryCount + 1);
        } else if (retryCount < 3) {
          this.logger.log(`falback to DEFAULT_COUNTRY ${DEFAULT_COUNTRY}`);
          agent = this.proxyService.getProxy(
            DEFAULT_COUNTRY,
            ProxyType.DATACENTER
          );
          return await fetchBookingHotels(payload, agent, retryCount + 1);
        }
        throw new BadRequestException("Pagination is null");
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
      const proxyAgent = this.proxyService.getProxy(command.countryCode);
      pagination = await fetchBookingHotels(payload, proxyAgent);
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
    const bookingHotels = hotelFiltered.map(
      (hotel: any) => new this.bookingHotelModel(hotel)
    );
    await this.bookingHotelModel.insertMany(bookingHotels);
  }

  private async onFinish(command: CrawlerCommand) {
    await this.crawlerJobService.updateJobStatus(
      command,
      CRAWLER_STATUS.FINISHED
    );
  }
}
