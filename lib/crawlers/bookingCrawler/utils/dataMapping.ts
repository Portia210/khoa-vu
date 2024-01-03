import type { TravelorHotelData } from "../types"

const dataMapping = (travelorHotelsData: TravelorHotelData[]) => {
  return travelorHotelsData?.map((hotel) => {
    return {
      hotel_id: hotel?.hotel_id,
      title: hotel?.name,
      price: hotel?.price,
      picture_link: hotel?.image,
      travelor_link: `https://www.travelor.com/hotels/place/${hotel?.hotel?.country?.slug}/${hotel?.hotel_id}`,
      country: hotel?.hotel.country,
      facilities: hotel?.hotel.facilities,
      stars: hotel?.stars,
      rating: hotel?.hotel?.star_rating
    }
  })
}

export { dataMapping }
