export interface CrawlerJobDto {
  _id: string
  dataSource: string
  destination: string
  checkInDate: string
  checkOutDate: string
  adult: number
  children: number
  rooms: number
  status: string
  createdAt: string
  updatedAt: string
  __v: number
}
