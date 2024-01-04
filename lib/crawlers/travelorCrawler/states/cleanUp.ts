import type { DataImporterContext } from "~lib/framework/dataImporter/context"
import {
    AuthState,
    DataSourceState,
    DataState,
    ImportState
} from "~lib/framework/dataStores/types/dataImporterState"

import { TRAVELOR_CRAWLER_FLOW_STATES } from "../constants"

export const cleanUpState = {
  [TRAVELOR_CRAWLER_FLOW_STATES.CLEAN_UP]: {
    invoke: {
      id: `${TRAVELOR_CRAWLER_FLOW_STATES.CLEAN_UP}`,
      src: async (context: DataImporterContext, event: any) => {
        console.log("cleanUpState.....")
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
      importState: ImportState.COMPLETED,
      authState: AuthState.AUTHENTICATED,
      dataState: DataState.DATA_RECEIVED,
      dataSourceState: DataSourceState.ENABLED
    }
  }
}
