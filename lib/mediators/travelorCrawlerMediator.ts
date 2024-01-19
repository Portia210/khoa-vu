import { createTab, fuzzySearchTabs } from "~components/utils/chromeTabs"
import { ImportMediatorType } from "~lib/constants"
import { DATA_SOURCES } from "~lib/constants/dataSources"
import { TRAVELOR_API } from "~lib/crawlers/travelorCrawler/constants"
import { dataImporterDataStore } from "~lib/framework/dataStores/dataImporterDataStore"
import { PUBSUB_MESSAGES } from "~lib/framework/pubSubController/types/messages"
import { ImportMediator } from "~lib/shared/importMediator"

class TravelorCrawlerMediator extends ImportMediator {
  constructor() {
    super(DATA_SOURCES.TRAVELOR, ImportMediatorType.ServiceWorker, {
      scheduleInterval: 10,
      scheduleUnit: "second"
    })
  }

  async startAuthentication(command?: any): Promise<void> {
    this.postMessage({
      type: PUBSUB_MESSAGES.START_AUTHENTICATION,
      dataSource: DATA_SOURCES.TRAVELOR
    })
    const isAuth = await this.checkAuthentication()
    if (!isAuth) return
    this.postMessage({
      type: PUBSUB_MESSAGES.IMPORT,
      dataSource: DATA_SOURCES.TRAVELOR,
      data: command
    })
  }

  async checkAuthentication(): Promise<boolean> {
    const checkTabs = await fuzzySearchTabs(TRAVELOR_API.LOGIN_URL)
    if (checkTabs?.length === 0) {
      const tab = await createTab({
        active: false,
        url: TRAVELOR_API.LOGIN_URL
      })
      if (!tab.id) {
        this.postMessage({
          type: PUBSUB_MESSAGES.AUTHENTICATION_ERROR,
          dataSource: DATA_SOURCES.TRAVELOR
        })
        return false
      }
    }
    return true
  }

  async getImporterStates(): Promise<any> {
    return await dataImporterDataStore.getStates(DATA_SOURCES.TRAVELOR)
  }
}

const travelorCrawlerMediator = new TravelorCrawlerMediator()
export { travelorCrawlerMediator }
