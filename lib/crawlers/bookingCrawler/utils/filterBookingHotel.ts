import { BOOKING_API } from "../constants"
import type {
  BookingBasicPropertyData,
  BookingHotelPhotos,
  BookingHotelResult
} from "../types/booking.hotel.response"

export const filterBookingHotel = (hotelResults: BookingHotelResult[]) => {
  return hotelResults.map((hotelResult) => {
    return {
      booking_link: getBookingLink(hotelResult?.basicPropertyData),
      title: hotelResult?.displayName?.text,
      price: hotelResult?.priceDisplayInfoIrene?.displayPrice?.amountPerStay,
      rate: hotelResult?.basicPropertyData?.reviewScore?.score,
      reviews: hotelResult?.basicPropertyData?.reviewScore,
      stars: hotelResult?.basicPropertyData?.starRating?.value,
      distance: hotelResult?.location?.mainDistance,
      photos: getHotelPhotos(hotelResult?.basicPropertyData?.photos)
    }
  })
}

const getBookingLink = (
  basicPropertyData: BookingBasicPropertyData
): string => {
  return `https://www.booking.com/hotel/${basicPropertyData.location.countryCode}/${basicPropertyData.pageName}`
}

const getHotelPhotos = (photo: BookingHotelPhotos): string => {
  const highJpeg = photo?.main?.highResJpegUrl?.relativeUrl
  const highWebp = photo?.main?.highResUrl?.relativeUrl
  return `${BOOKING_API.BASE_IMG_URL}${highJpeg || highWebp}`
}
