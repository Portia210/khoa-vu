import dayjs from "dayjs"

import type { CrawlerCommand } from "~lib/shared/types/CrawlerCommand"

import { BOOKING_API } from "../constants"
import type {
  BookingBasicPropertyData,
  BookingHotelPhotos,
  BookingHotelResult
} from "../types/booking.hotel.response"

export const dataMapping = (
  command: CrawlerCommand,
  hotelResults: BookingHotelResult[]
) => {
  return hotelResults?.map((hotelResult) => {
    return {
      hotel_id: hotelResult?.basicPropertyData?.id,
      title: hotelResult?.displayName?.text,
      picture_link: getHotelPhoto(hotelResult?.basicPropertyData?.photos),
      booking_link: getBookingLink(command, hotelResult?.basicPropertyData),
      price: hotelResult?.priceDisplayInfoIrene?.displayPrice?.amountPerStay,
      rate: hotelResult?.basicPropertyData?.reviewScore?.score,
      reviews: hotelResult?.basicPropertyData?.reviewScore,
      stars: hotelResult?.basicPropertyData?.starRating?.value,
      distance: hotelResult?.location?.mainDistance,
      jobId: command?._id,
    }
  })
}
// aid is the affiliate id
const getBookingLink = (
  command: CrawlerCommand,
  basicPropertyData: BookingBasicPropertyData
): string => {
  const baseUrl = `https://www.booking.com/hotel/${basicPropertyData.location.countryCode}/${basicPropertyData.pageName}`

  const url = new URLSearchParams({
    checkin: dayjs(command?.checkInDate).format("YYYY-MM-DD"),
    checkout: dayjs(command?.checkOutDate).format("YYYY-MM-DD"),
    dest_id: command?.destination?.placeId,
    dest_type: command.destination?.dest_type,
    group_adults: command?.adult?.toString(),
    no_rooms: command?.rooms?.toString(),
    req_adults: command?.adult?.toString(),
    group_children: command?.children?.toString(),
    req_children: command?.children?.toString()
  })
  for (const childAge of command?.childrenAges) {
    url.append("req_age", childAge?.toString())
    url.append("age", childAge?.toString())
  }
  return `${baseUrl}?${url.toString()}`
}

const getHotelPhoto = (photo: BookingHotelPhotos): string => {
  const highJpeg = photo?.main?.highResJpegUrl?.relativeUrl
  const highWebp = photo?.main?.highResUrl?.relativeUrl
  return `${BOOKING_API.BASE_IMG_URL}${highJpeg || highWebp}`
}
