class TravelorCrawlerService {
  constructor() {}

  async importHotels() {
    const finishedCurrentState = true
    return {
      finishedCurrentState
    }
  }
}

const travelorCrawlerService = new TravelorCrawlerService()
export { travelorCrawlerService }