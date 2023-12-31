import { useTravelorCrawlerStateStore } from "./useTravelorCrawlerStateStore"

const TravelorCrawlerComponent = () => {
  const { startAuthentication } = useTravelorCrawlerStateStore()
  return (
    <>
      <p className="text-red-300">TravelorCrawlerComponent</p>
    </>
  )
}

export default TravelorCrawlerComponent
