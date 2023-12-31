import "./style.css"

import TravelorCrawlerComponent from "~components/travelor/TravelorCrawler"

function IndexPopup() {
  return (
    <div
      style={{
        padding: 16,
        height: 300,
        width: 300,
      }}>
      <h2 className="mb-4 text-center text-lg font-bold">TourCrawler Extension!</h2>
      <div>
        <TravelorCrawlerComponent />
      </div>
    </div>
  )
}

export default IndexPopup
