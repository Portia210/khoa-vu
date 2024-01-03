import { useBookingCrawlerStateStore } from "./useBookingCrawlerStateStore"

const BookingCrawlerComponent = () => {
  const { startAuthentication } = useBookingCrawlerStateStore()
  return (
    <>
      <button
        className="p-3 bg-blue-300 w-full text-white font-bolder text-lg"
        onClick={startAuthentication}>
        Start Booking Crawler
      </button>
    </>
  )
}

export default BookingCrawlerComponent
