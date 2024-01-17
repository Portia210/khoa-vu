import { v4 as uuid } from "uuid"
import { createMachine, type StateMachine } from "xstate"

import { DATA_SOURCES } from "~lib/constants/dataSources"
import type { DataImporterContext } from "~lib/framework/dataImporter/context"

import { DataImporter } from "../../framework/dataImporter"
import { PUBSUB_MESSAGES } from "../../framework/pubSubController/types/messages"
import { commonDelays } from "../../sharedXState/delays.common"
import { commonImporterEvents } from "../../sharedXState/events.common"
import { commonImportFlowStates } from "../../sharedXState/importFlowStates.common"
import { TRAVELOR_CRAWLER_FLOW_STATES } from "./constants"
import * as states from "./states"

class TravelorCrawler extends DataImporter {
  constructor() {
    const identifier = uuid()
    super(DATA_SOURCES.TRAVELOR, identifier, PUBSUB_MESSAGES.IMPORT)
    this.identifier = identifier
  }

  async fetchConfiguration(): Promise<boolean> {
    /* TODO: Modify this method to fetch the configuration from the database if needed */
    return true
  }

  initializeImportMachine(): StateMachine<DataImporterContext, any, any> {
    return createMachine(
      {
        id: "travelor-crawler",
        version: "1",
        initial: TRAVELOR_CRAWLER_FLOW_STATES.DISABLED,
        context: {
          dataSource: DATA_SOURCES.TRAVELOR,
          hasData: false,
          targetState: "",
        } as DataImporterContext,
        states: {
          ...commonImportFlowStates,
          ...states.importState,
          ...states.cleanUpState,
          ...states.switchState
        },
        ...commonImporterEvents
      },
      {
        ...commonDelays
      }
    )
  }
}

const travelorCrawler = new TravelorCrawler()
export { travelorCrawler }
