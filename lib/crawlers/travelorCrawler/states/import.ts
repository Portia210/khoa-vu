import {
    AuthState,
    DataSourceState,
    DataState,
    ImportState
} from "~lib/framework/dataStores/types/dataImporterState"
import type { DataImporterContext } from "~lib/framework/dataImporter/context"

import { TRAVELOR_CRAWLER_FLOW_STATES } from "../constants"

export const importState = {
  [TRAVELOR_CRAWLER_FLOW_STATES.IMPORT]: {
    invoke: {
      id: `${TRAVELOR_CRAWLER_FLOW_STATES.IMPORT}`,
      src: async (context: DataImporterContext, event: any) => {
        // TODO: import data
        console.log("importing data event", event)
        console.log("importing data", context)
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
