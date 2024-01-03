export interface TravelorHotelResponse {
  hotelsData: TravelorHotelData[]
  session: string
  meta: any
  status: "running" | "finished"
}

export interface TravelorHotelStatus {
  totalResults: number
  status: "running" | "finished"
}

export interface TravelorHotelData {
  hotel_id: number
  name: string
  address: string
  geoloc: TravelorGeoloc
  distance: number
  price: TravelorPrice
  client_price: TravelorClientPrice
  stars: string
  image: string
  hotel: TravelorHotel
  reviews: TravelorReviews
}

export interface TravelorGeoloc {
  lat: string
  lon: string
}

export interface TravelorPrice {
  amount: number
  commission: number
  currency: string
  exclusive: number
  inclusive: number
  taxes: number
}

export interface TravelorClientPrice {
  amount: number
  commission: number
  currency: string
  exclusive: number
  inclusive: number
  taxes: number
}

export interface TravelorHotel {
  aggregator: string
  id: number
  type: string
  slug: number
  name: string
  title: string
  star_rating: number
  address: string
  email: string
  phone: any
  _geoloc: TravelorGeoloc2
  popularity: number
  city_name: string
  image: TravelorImage
  country: TravelorCountry
  facilities: TravelorFacility[]
}

export interface TravelorGeoloc2 {
  lat: number
  lng: number
}

export interface TravelorImage {
  id: string
  title: any
  url: string
  width: number
  height: number
  priority: number
}

export interface TravelorCountry {
  id: number
  slug: string
  code: string
  name: string
  title: string
  _geoloc: TravelorGeoloc2
}

export interface TravelorFacility {
  id: number
  name: string
  type: string
}

export interface TravelorReviews {
  rating: any
  booking_rating: any
  trustyou_rating: any
  count: any
}
