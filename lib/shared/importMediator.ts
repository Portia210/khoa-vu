import { ImportMediatorType, type WorkerMessage } from "~lib/constants"
import type { DataSourceType } from "~lib/constants/dataSources"
import type { ScheduleImportConfig } from "~lib/framework/dataImporter/types/scheduleUnit"
import { dataImporterDataStore } from "~lib/framework/dataStores/dataImporterDataStore"
import { ImportState } from "~lib/framework/dataStores/types/dataImporterState"
import { PubSubController } from "~lib/framework/pubSubController"
import { PUBSUB_MESSAGES } from "~lib/framework/pubSubController/types/messages"

import { directImporters } from "./directImporters"

// const ImporterWorker = new Worker(
//   new URL("../mediators/serviceWorker/worker?worker&inline", import.meta.url),
//   { type: "module" }
// )

export class ImportMediator extends PubSubController {
  private dataSource!: DataSourceType
  private type!: ImportMediatorType
  private scheduleImportConfig!: ScheduleImportConfig
  // static importWorker = ImporterWorker

  constructor(
    dataSource: DataSourceType,
    type: ImportMediatorType,
    defaultScheduleImportConfig?: ScheduleImportConfig
  ) {
    super()
    Object.assign(this, {
      dataSource,
      type,
      scheduleImportConfig: defaultScheduleImportConfig
    })
    this.initializeState()
    if (defaultScheduleImportConfig)
      this.setScheduleImport(defaultScheduleImportConfig)

    if (type === ImportMediatorType.ServiceWorker) {
      // ImportMediator.importWorker.postMessage({
      //   type: PUBSUB_MESSAGES.INITIALIZE,
      //   dataSource
      // })
    } else {
      directImporters[dataSource].initialize().then(() => {
        console.log(
          `${dataSource} non-worker initialized, now resume any current state`,
          directImporters[dataSource].identifier
        )
        directImporters[dataSource].publish(
          `${PUBSUB_MESSAGES.RESUME}.${dataSource}`,
          {
            identifier: directImporters[dataSource].identifier
          }
        )
      })
    }
  }

  postMessage(message: WorkerMessage) {
    if (this.type === ImportMediatorType.ServiceWorker) {
      // ImportMediator.importWorker.postMessage(message)
      return
    }

    this.publish(`${message.type}.${message.dataSource}`, {
      identifier: directImporters[message.dataSource].identifier,
      context: {
        ...message
      }
    })
  }

  async initializeState() {
    const importState = await dataImporterDataStore.states.get(this.dataSource)
    if (!importState) {
      await dataImporterDataStore.states.put({
        dataSourceName: this.dataSource,
        currentState: "",
        importState: ImportState.DISABLED,
        lastUpdated: new Date()
      })
    }
  }

  async setScheduleImport(scheduleImportConfig: ScheduleImportConfig) {
    let importState = await dataImporterDataStore.states.get(this.dataSource)
    if (!importState) {
      scheduleImportConfig.overwrite = true
      importState = {
        dataSourceName: this.dataSource,
        currentState: "",
        importState: ImportState.ENABLED,
        lastUpdated: new Date(),
        schedule: scheduleImportConfig
      }
    }

    if (!importState.schedule || scheduleImportConfig.overwrite) {
      importState.schedule = scheduleImportConfig
      await dataImporterDataStore.states.put(importState)
      this.postMessage({
        type: PUBSUB_MESSAGES.UPDATE_SCHEDULE_IMPORT,
        dataSource: this.dataSource
      })
    }
  }
}
