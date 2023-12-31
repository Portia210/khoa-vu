import Dexie from "dexie"

import type { DataSourceType } from "~lib/constants/dataSources"

import {
  DataSourceState,
  ImportState,
  type DataImporterState
} from "./types/dataImporterState"

const DB_VERSION = 1
const DB_NAME = "dataImporter"

/**
 * Data store to keep the importer state
 */
class DataImporterDataStore extends Dexie {
  states!: Dexie.Table<DataImporterState>

  constructor() {
    super(DB_NAME)
    this.version(DB_VERSION).stores({
      states: "&dataSourceName"
    })
  }

  /**
   * Set the importState of the importer
   * @param dataSourceName
   * @param importState
   */
  async setImportState(
    dataSourceName: DataSourceType,
    importState: ImportState
  ) {
    const state = await this.states.get(dataSourceName)

    const newState: DataImporterState = {
      ...state,
      dataSourceName,
      importState,
      lastUpdated: new Date(),
      currentState: state?.currentState || ""
    }

    this.states.put(newState, 0)
  }

  /**
   * Get the states of a data source
   * @param dataSourceName
   * @returns
   */
  async getStates(dataSourceName: string) {
    const states = await this.states.get(dataSourceName)
    return {
      dataSourceState: states?.dataSourceState || DataSourceState.DISABLED,
      authState: states?.authState,
      dataState: states?.dataState,
      errorState: states?.errorState
    }
  }
}

const dataImporterDataStore = new DataImporterDataStore()
export { dataImporterDataStore }
