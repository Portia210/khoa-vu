import type { DataImporterContext } from "~lib/framework/dataImporter/context"
import {
  AuthState,
  DataSourceState,
  DataState,
  ImportState
} from "~lib/framework/dataStores/types/dataImporterState"

import { TRAVELOR_CRAWLER_FLOW_STATES } from "../constants"
import { TravelorCrawlerService } from "../service/TravelorCrawlerService"

export const importState = {
  [TRAVELOR_CRAWLER_FLOW_STATES.IMPORT]: {
    invoke: {
      id: `${TRAVELOR_CRAWLER_FLOW_STATES.IMPORT}`,
      src: async (context: DataImporterContext, event: any) => {
        console.log("travelor importState.....context ", context)
        console.log("travelor importState.....event ", event)
        if (!event.data) throw Error("No command provided")
        const travelorCrawlerService = new TravelorCrawlerService()
        await travelorCrawlerService.importHotels(event.data)
      },
      onDone: {
        target: `${TRAVELOR_CRAWLER_FLOW_STATES.CLEAN_UP}`
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
