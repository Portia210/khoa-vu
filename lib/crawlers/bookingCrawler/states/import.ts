import axios from "axios"

import { DATA_SOURCES } from "~lib/constants/dataSources"
import { BASE_URL } from "~lib/constants/enviroment"
import type { DataImporterContext } from "~lib/framework/dataImporter/context"
import {
  AuthState,
  DataSourceState,
  DataState,
  ImportState
} from "~lib/framework/dataStores/types/dataImporterState"
import type { CrawlerCommand } from "~lib/shared/types/CrawlerCommand"
import { CrawlerCommandService } from "~service/CrawlerCommandService"

import { BOOKING_CRAWLER_FLOW_STATES } from "../constants"
import { BookingCrawlerService } from "../service/BookingCrawlerService"

export const importState = {
  [BOOKING_CRAWLER_FLOW_STATES.IMPORT]: {
    invoke: {
      id: `${BOOKING_CRAWLER_FLOW_STATES.IMPORT}`,
      src: async (context: DataImporterContext, event: any) => {
        const commands = await CrawlerCommandService.fetchJobs(
          DATA_SOURCES.BOOKING
        )
        for (const command of commands) {
          const bookingCrawlerService = new BookingCrawlerService()
          bookingCrawlerService.importHotels(command)
        }
      },
      onDone: {
        target: `${BOOKING_CRAWLER_FLOW_STATES.IMPORT_COMPLETED}`
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
