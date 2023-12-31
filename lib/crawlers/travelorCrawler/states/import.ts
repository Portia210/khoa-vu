import type { DataImporterContext } from "~lib/framework/dataImporter/context"
import {
  AuthState,
  DataSourceState,
  DataState,
  ImportState
} from "~lib/framework/dataStores/types/dataImporterState"

import { TRAVELOR_CRAWLER_FLOW_STATES } from "../constants"
import { travelorCrawlerService } from "../service/TravelorCrawlerService"

export const importState = {
  [TRAVELOR_CRAWLER_FLOW_STATES.IMPORT]: {
    invoke: {
      id: `${TRAVELOR_CRAWLER_FLOW_STATES.IMPORT}`,
      src: async (context: DataImporterContext, event: any) => {
        if (!event.tabId) throw new Error("TRAVELOR_CRAWLER_FLOW_STATES.IMPORT tabId is not defined")
        const { finishedCurrentState } =
          await travelorCrawlerService.importHotels(event.tabId)
        context.finishedCurrentState = finishedCurrentState
      },
      onDone: {
        target: `${TRAVELOR_CRAWLER_FLOW_STATES.SWITCH}`
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
