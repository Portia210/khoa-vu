import { closeTabById, createTab } from "~components/utils/chromeTabs"
import { ImportMediatorType } from "~lib/constants"
import { DATA_SOURCES } from "~lib/constants/dataSources"
import { TRAVELOR_API } from "~lib/crawlers/travelorCrawler/constants"
import { dataImporterDataStore } from "~lib/framework/dataStores/dataImporterDataStore"
import { PUBSUB_MESSAGES } from "~lib/framework/pubSubController/types/messages"
import { ImportMediator } from "~lib/shared/importMediator"

class TravelorCrawlerMediator extends ImportMediator {
  constructor() {
    super(DATA_SOURCES.TRAVELOR, ImportMediatorType.Direct)
  }

  async startAuthentication(): Promise<void> {
    this.postMessage({
      type: PUBSUB_MESSAGES.START_AUTHENTICATION,
      dataSource: DATA_SOURCES.TRAVELOR
    })
    await this.checkAuthentication()
  }

  async checkAuthentication(): Promise<void> {
    const tab = await createTab({
      active: false,
      url: TRAVELOR_API.LOGIN_URL
    })

    if (!tab.id) {
      return this.postMessage({
        type: PUBSUB_MESSAGES.AUTHENTICATION_ERROR,
        dataSource: DATA_SOURCES.TRAVELOR
      })
    }

    this.postMessage({
      type: PUBSUB_MESSAGES.IMPORT,
      dataSource: DATA_SOURCES.TRAVELOR,
      tabId: tab.id as number
    })
  }

  async getImporterStates(): Promise<any> {
    return await dataImporterDataStore.getStates(DATA_SOURCES.TRAVELOR)
  }
}

const travelorCrawlerMediator = new TravelorCrawlerMediator()
export { travelorCrawlerMediator }
