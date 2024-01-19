import { createTab, fuzzySearchTabs } from "~components/utils/chromeTabs"
import { ImportMediatorType } from "~lib/constants"
import { DATA_SOURCES } from "~lib/constants/dataSources"
import { BOOKING_API } from "~lib/crawlers/bookingCrawler/constants"
import { dataImporterDataStore } from "~lib/framework/dataStores/dataImporterDataStore"
import { PUBSUB_MESSAGES } from "~lib/framework/pubSubController/types/messages"
import { ImportMediator } from "~lib/shared/importMediator"

class BookingCrawlerMediator extends ImportMediator {
  constructor() {
    super(DATA_SOURCES.BOOKING, ImportMediatorType.Direct, {
      scheduleInterval: 5,
      scheduleUnit: "second"
    })
  }

  async startAuthentication(command?: any): Promise<void> {
    this.postMessage({
      type: PUBSUB_MESSAGES.START_AUTHENTICATION,
      dataSource: DATA_SOURCES.BOOKING
    })
    // const isAuth = await this.checkAuthentication()
    // if (!isAuth) return
    this.postMessage({
      type: PUBSUB_MESSAGES.IMPORT,
      dataSource: DATA_SOURCES.BOOKING,
      data: command
    })
  }

  async checkAuthentication(): Promise<boolean> {
    const checkTabs = await fuzzySearchTabs(BOOKING_API.LOGIN_URL)
    if (checkTabs?.length === 0) {
      const tab = await createTab({
        active: false,
        url: BOOKING_API.LOGIN_URL
      })
      if (!tab.id) {
        this.postMessage({
          type: PUBSUB_MESSAGES.AUTHENTICATION_ERROR,
          dataSource: DATA_SOURCES.BOOKING
        })
        return false
      }
    }
    return true
  }

  async getImporterStates(): Promise<any> {
    return await dataImporterDataStore.getStates(DATA_SOURCES.BOOKING)
  }
}

const bookingCrawlerMediator = new BookingCrawlerMediator()
export { bookingCrawlerMediator }
