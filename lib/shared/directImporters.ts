import { DATA_SOURCES } from "~lib/constants/dataSources"
import { bookingCrawler } from "~lib/crawlers/bookingCrawler/bookingCrawler"
import { travelorCrawler } from "~lib/crawlers/travelorCrawler/travelorCrawler"
import type { DataImporter } from "~lib/framework/dataImporter"

export const directImporters: Record<string, DataImporter> = {
  [DATA_SOURCES.TRAVELOR]: travelorCrawler,
  [DATA_SOURCES.BOOKING]: bookingCrawler
}
