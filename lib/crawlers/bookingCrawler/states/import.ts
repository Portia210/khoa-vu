import type { DataImporterContext } from "~lib/framework/dataImporter/context"
import {
  AuthState,
  DataSourceState,
  DataState,
  ImportState
} from "~lib/framework/dataStores/types/dataImporterState"

import { BOOKING_CRAWLER_FLOW_STATES } from "../constants"
import { bookingCrawlerService } from "../service/BookingCrawlerService"

export const importState = {
  [BOOKING_CRAWLER_FLOW_STATES.IMPORT]: {
    invoke: {
      id: `${BOOKING_CRAWLER_FLOW_STATES.IMPORT}`,
      src: async (context: DataImporterContext, event: any) => {
        if (!event.data) throw Error("No command provided")
        const { finishedCurrentState } =
          await bookingCrawlerService.importHotels(event.data)
        context.finishedCurrentState = finishedCurrentState
      },
      onDone: {
        target: `${BOOKING_CRAWLER_FLOW_STATES.CLEAN_UP}`
      },
      onError: {
        target: `${BOOKING_CRAWLER_FLOW_STATES.IMPORT_ERROR}`,
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
