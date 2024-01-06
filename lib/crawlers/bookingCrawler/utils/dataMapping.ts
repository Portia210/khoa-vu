import { BOOKING_API } from "../constants"
import type {
  BookingBasicPropertyData,
  BookingHotelPhotos,
  BookingHotelResult
} from "../types/booking.hotel.response"

export const dataMapping = (hotelResults: BookingHotelResult[]) => {
  return hotelResults?.map((hotelResult) => {
    return {
      title: hotelResult?.displayName?.text,
      picture_link: getHotelPhoto(hotelResult?.basicPropertyData?.photos),
      booking_link: getBookingLink(hotelResult?.basicPropertyData),
      price: hotelResult?.priceDisplayInfoIrene?.displayPrice?.amountPerStay,
      rate: hotelResult?.basicPropertyData?.reviewScore?.score,
      reviews: hotelResult?.basicPropertyData?.reviewScore,
      stars: hotelResult?.basicPropertyData?.starRating?.value,
      distance: hotelResult?.location?.mainDistance
    }
  })
}

const getBookingLink = (
  basicPropertyData: BookingBasicPropertyData
): string => {
  return `https://www.booking.com/hotel/${basicPropertyData.location.countryCode}/${basicPropertyData.pageName}`
}

const getHotelPhoto = (photo: BookingHotelPhotos): string => {
  const highJpeg = photo?.main?.highResJpegUrl?.relativeUrl
  const highWebp = photo?.main?.highResUrl?.relativeUrl
  return `${BOOKING_API.BASE_IMG_URL}${highJpeg || highWebp}`
}
