import dayjs from "dayjs";
import { CrawlerCommand } from "src/shared/types/CrawlerCommand";
import type { TravelorHotelData, TravelorSearchQuery } from "../types";

const dataMapping = (
  command: CrawlerCommand,
  sessionId: string,
  travelorHotelsData: TravelorHotelData[],
  travelorSearchQuery: TravelorSearchQuery
) => {
  return travelorHotelsData?.map((hotel) => {
    const travelorLink = `https://www.travelor.com/hotels/place/${hotel?.hotel?.country?.slug}/${hotel?.hotel_id}`;
    return {
      hotel_id: hotel?.hotel_id,
      title: hotel?.name,
      price: hotel?.price,
      picture_link: hotel?.image,
      travelor_link: createTravelorLink(command, sessionId, travelorLink),
      country: hotel?.hotel.country,
      facilities: hotel?.hotel.facilities,
      stars: hotel?.stars,
      reviews: hotel?.reviews,
      jobId: command?._id,
      travelor_geoloc: hotel?.geoloc,
      travelor_distance: hotel?.distance,
      travelor_search_query: travelorSearchQuery,
    };
  });
};

const createTravelorLink = (
  command: CrawlerCommand,
  sessionId: string,
  orginalLink: string
) => {
  return `${orginalLink}?fid=&check_in=${dayjs(command?.checkInDate).format(
    "YYYY-MM-DD"
  )}&check_out=${dayjs(command?.checkOutDate).format("YYYY-MM-DD")}&guests=${
    command?.guests
  }&country=${
    command?.countryCode?.toUpperCase() || "US"
  }&currency=ILS&session=${sessionId}`;
};

export { dataMapping };
