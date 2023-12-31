import "./style.css"

import TravelorCrawlerComponent from "~components/travelor/TravelorCrawler"

function IndexPopup() {
  return (
    <div
      style={{
        padding: 16
      }}>
      <h2>TourCrawler Extension!</h2>
      <div>
        <TravelorCrawlerComponent />
      </div>
    </div>
  )
}

export default IndexPopup
