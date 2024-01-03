import { createTab } from "~components/utils/chromeTabs"
import { ImportMediatorType } from "~lib/constants"
import { DATA_SOURCES } from "~lib/constants/dataSources"
import { BOOKING_API } from "~lib/crawlers/bookingCrawler/constants"
import { dataImporterDataStore } from "~lib/framework/dataStores/dataImporterDataStore"
import { PUBSUB_MESSAGES } from "~lib/framework/pubSubController/types/messages"
import { ImportMediator } from "~lib/shared/importMediator"

class BookingCrawlerMediator extends ImportMediator {
  constructor() {
    super(DATA_SOURCES.BOOKING, ImportMediatorType.Direct)
  }

  async startAuthentication(): Promise<void> {
    this.postMessage({
      type: PUBSUB_MESSAGES.START_AUTHENTICATION,
      dataSource: DATA_SOURCES.BOOKING
    })
    await this.checkAuthentication()
  }

  async checkAuthentication(): Promise<void> {
    const tab = await createTab({
      active: false,
      url: BOOKING_API.LOGIN_URL
    })

    if (!tab.id) {
      return this.postMessage({
        type: PUBSUB_MESSAGES.AUTHENTICATION_ERROR,
        dataSource: DATA_SOURCES.BOOKING
      })
    }

    this.postMessage({
      type: PUBSUB_MESSAGES.IMPORT,
      dataSource: DATA_SOURCES.BOOKING,
      tabId: tab.id as number
    })
  }

  async getImporterStates(): Promise<any> {
    return await dataImporterDataStore.getStates(DATA_SOURCES.BOOKING)
  }
}

const bookingCrawlerMediator = new BookingCrawlerMediator()
export { bookingCrawlerMediator }
