class BookingCrawlerService {
  constructor() {}

  async importHotels(tabId: number): Promise<any> {
    return {
      finishedCurrentState: true
    }
  }
}

const bookingCrawlerService = new BookingCrawlerService()
export { bookingCrawlerService }
