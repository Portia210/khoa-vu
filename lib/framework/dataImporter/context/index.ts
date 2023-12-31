import type { DATA_SOURCES } from "~lib/constants/dataSources"

type BaseDataImporterContext = {
  dataSource: DATA_SOURCES
  hasData: boolean,
  finishedCurrentState: boolean
  errorMsg?: string
  scheduledImport?: boolean
}

export interface DataImporterContext
  extends BaseDataImporterContext,
    Record<string, any> {}
