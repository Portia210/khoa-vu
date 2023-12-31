
import { ImportMediatorType } from "~lib/constants"
import { DATA_SOURCES } from "~lib/constants/dataSources"
import { dataImporterDataStore } from "~lib/dataStores/dataImporterDataStore"
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
    /* TODO: Add code here to start authentication */
    /* For example, redirect to the authentication page */
    this.postMessage({
      type: PUBSUB_MESSAGES.IMPORT,
      dataSource: DATA_SOURCES.TRAVELOR
    })
  }

  async getImporterStates(): Promise<any> {
    return await dataImporterDataStore.getStates(DATA_SOURCES.TRAVELOR)
  }
}

const travelorCrawlerMediator = new TravelorCrawlerMediator()
export { travelorCrawlerMediator }
