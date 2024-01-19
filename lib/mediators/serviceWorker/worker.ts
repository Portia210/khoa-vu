/// <reference lib="webworker" />

import type { WorkerMessage } from "~lib/constants"
import type { DataImporter } from "~lib/framework/dataImporter"
import { PUBSUB_MESSAGES } from "~lib/framework/pubSubController/types/messages"
import { swImporters } from "~lib/shared/serviceWorkerImporters"

self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  if (event.data.type === PUBSUB_MESSAGES.INITIALIZE) {
    initializeImporter(event.data.dataSource)
    return
  }

  publishToImporter(event.data.dataSource, event.data)
})

const initializeImporter = (dataSource: string) => {
  const importer: DataImporter = swImporters[dataSource]
  importer.initialize().then(() => {
    console.log(
      `${dataSource} worker initialized, now resume any current state`,
      importer.identifier
    )

    importer.publish(`${PUBSUB_MESSAGES.RESUME}.${dataSource}`, {
      identifier: importer.identifier
    })
  })
}

const publishToImporter = (dataSource: string, message: WorkerMessage) => {
  const importer: DataImporter = swImporters[dataSource]
  importer.publish(`${message.type}.${dataSource}`, {
    identifier: importer.identifier,
    context: {
      ...message
    }
  })
}
