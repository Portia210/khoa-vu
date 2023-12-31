import { useTravelorCrawlerStateStore } from "./useTravelorCrawlerStateStore"

const TravelorCrawlerComponent = () => {
  const { startAuthentication } = useTravelorCrawlerStateStore()
  return (
    <>
      <button
        className="p-3 bg-green-300 w-full text-white font-bolder text-lg"
        onClick={startAuthentication}>
        Start Travelor Crawler
      </button>
    </>
  )
}

export default TravelorCrawlerComponent
