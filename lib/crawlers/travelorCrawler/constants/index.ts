import { BASE_STATES } from "~lib/sharedXState/baseStates.common"
import { IMPORT_FLOW_STATES } from "~lib/sharedXState/importFlowStates.common"

export enum TRAVELOR_SPECIFIC_STATES {
  IMPORT_HOTELS = "importHotels",
}

export const TRAVELOR_CRAWLER_FLOW_STATES = {
  ...TRAVELOR_SPECIFIC_STATES,
  ...IMPORT_FLOW_STATES,
  ...BASE_STATES
}