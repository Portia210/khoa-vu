import { DATA_SOURCES } from "~lib/constants/dataSources"
import type { DataImporterContext } from "~lib/framework/dataImporter/context"
import {
  AuthState,
  DataSourceState,
  DataState,
  ImportState
} from "~lib/framework/dataStores/types/dataImporterState"
import { CrawlerCommandService } from "~service/CrawlerCommandService"

import { TRAVELOR_CRAWLER_FLOW_STATES } from "../constants"
import { TravelorCrawlerService } from "../service/TravelorCrawlerService"

export const importState = {
  [TRAVELOR_CRAWLER_FLOW_STATES.IMPORT]: {
    invoke: {
      id: `${TRAVELOR_CRAWLER_FLOW_STATES.IMPORT}`,
      src: async (context: DataImporterContext, event: any) => {
        const commands = await CrawlerCommandService.fetchJobs(
          DATA_SOURCES.TRAVELOR
        )
        for (const command of commands) {
          const travelorCrawlerService = new TravelorCrawlerService()
          travelorCrawlerService.importHotels(command)
        }
      },
      onDone: {
        target: `${TRAVELOR_CRAWLER_FLOW_STATES.IMPORT_COMPLETED}`
      },
      onError: {
        target: `${TRAVELOR_CRAWLER_FLOW_STATES.IMPORT_ERROR}`,
        actions: (context: any, event: any) => {
          context.errorMsg = event.data?.message
          console.error(event.data)
        }
      }
    },
    meta: {
      importState: ImportState.IMPORTING,
      authState: AuthState.AUTHENTICATED,
      dataState: DataState.FETCHING,
      dataSourceState: DataSourceState.ENABLED
    }
  }
}
