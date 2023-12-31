import {
  DataSourceState,
  DataState,
  ErrorState,
  ImportState
} from "~lib/dataStores/types/dataImporterState"
import type { DataImporterContext } from "~lib/framework/dataImporter/context"
import { calculateNextScheduleRunIntervalFromNow } from "~lib/framework/utils/calculateNextScheduleRunDate"

import { baseSharedStates } from "./baseStates.common"

export enum IMPORT_FLOW_STATES {
  FINISHED = "finished",
  FIRST_FETCH_ERROR = "firstFetchError",
  IMPORT = "import",
  IMPORT_COMPLETED = "importCompleted",
  IMPORT_COMPLETED_DATA_RECEIVED = "importCompletedDataReceived",
  IMPORT_COMPLETED_NO_DATA = "importCompletedNoData",
  IMPORT_ERROR = "importError",
  SCHEDULED_IMPORT = "scheduledImport",
  WAIT_FOR_NEXT_IMPORT = "waitForNextImport"
}

export enum IMPORT_FLOW_DELAYS {
  NEXT_IMPORT_RUN_INTERVAL = "nextImportRunInterval"
}

const importCompletedState = {
  [IMPORT_FLOW_STATES.IMPORT_COMPLETED]: {
    always: [
      {
        target: `${IMPORT_FLOW_STATES.IMPORT_COMPLETED_DATA_RECEIVED}`,
        cond: (context: any, _: any) => context.hasData
      },
      {
        target: `${IMPORT_FLOW_STATES.IMPORT_COMPLETED_NO_DATA}`,
        cond: (context: any, _: any) => !context.hasData
      }
    ]
  }
}

const firstFetchErrorState = {
  [IMPORT_FLOW_STATES.FIRST_FETCH_ERROR]: {
    always: [
      {
        target: `${IMPORT_FLOW_STATES.IMPORT_ERROR}`,
        cond: (context: any, _: any) => context.retry > 3
      }
    ],
    after: {
      2000: {
        target: `${IMPORT_FLOW_STATES.IMPORT}`,
        cond: (context: any, _: any) => {
          context.retry = context.retry + 1
          return context.retry <= 3
        }
      }
    }
  }
}

const importCompletedDataReceived = {
  [IMPORT_FLOW_STATES.IMPORT_COMPLETED_DATA_RECEIVED]: {
    invoke: {
      src: async () => {},
      onDone: {
        target: `${IMPORT_FLOW_STATES.SCHEDULED_IMPORT}`
      }
    },
    meta: {
      importState: ImportState.COMPLETED,
      dataSourceState: DataSourceState.ENABLED,
      dataState: DataState.DATA_RECEIVED
    }
  }
}

const importCompletedNoData = {
  [IMPORT_FLOW_STATES.IMPORT_COMPLETED_NO_DATA]: {
    invoke: {
      src: async () => {},
      onDone: {
        target: `${IMPORT_FLOW_STATES.SCHEDULED_IMPORT}`
      }
    },
    meta: {
      importState: ImportState.COMPLETED,
      dataSourceState: DataSourceState.ENABLED,
      dataState: DataState.NO_DATA
    }
  }
}

const importErrorState = {
  [IMPORT_FLOW_STATES.IMPORT_ERROR]: {
    meta: {
      importState: ImportState.CRITICAL_ERROR,
      errorState: ErrorState.ERROR,
      dataSourceState: DataSourceState.ENABLED,
      errorMsg: "Error importing data"
    }
  }
}

const finishedImportState = {
  [IMPORT_FLOW_STATES.FINISHED]: {}
}

const scheduledImportState = {
  [IMPORT_FLOW_STATES.SCHEDULED_IMPORT]: {
    invoke: {
      id: "scheduledImport",
      src: async (context: DataImporterContext) => {
        const { scheduledImport, intervalMs } =
          await calculateNextScheduleRunIntervalFromNow(context.dataSource)
        context.scheduledImport = scheduledImport
        context.intervalMs = intervalMs
      },
      onDone: {
        target: `${IMPORT_FLOW_STATES.WAIT_FOR_NEXT_IMPORT}`
      }
    }
  }
}

const waitForNextImportState = {
  [IMPORT_FLOW_STATES.WAIT_FOR_NEXT_IMPORT]: {
    always: [
      {
        target: `${IMPORT_FLOW_STATES.FINISHED}`,
        cond: (context: DataImporterContext, _: any) => !context.scheduledImport
      }
    ],
    after: {
      [IMPORT_FLOW_DELAYS.NEXT_IMPORT_RUN_INTERVAL]: {
        target: `${IMPORT_FLOW_STATES.IMPORT}`
      }
    }
  }
}

export const commonImportFlowStates = {
  ...baseSharedStates,
  ...importCompletedState,
  ...importErrorState,
  ...importCompletedDataReceived,
  ...importCompletedNoData,
  ...firstFetchErrorState,
  ...scheduledImportState,
  ...finishedImportState,
  ...waitForNextImportState
}
