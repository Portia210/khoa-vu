import BookingCrawlerComponent from "~components/booking/BookingCrawler"
import TravelorCrawlerComponent from "~components/travelor/TravelorCrawler"
import CrawlerWrapperComponent from "~components/wrapper"

export default function IndexTab() {
  return (
    <CrawlerWrapperComponent>
      <TravelorCrawlerComponent />
      <BookingCrawlerComponent />
    </CrawlerWrapperComponent>
  )
}
