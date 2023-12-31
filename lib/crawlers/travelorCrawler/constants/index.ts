import { BASE_STATES } from "~lib/sharedXState/baseStates.common"
import { IMPORT_FLOW_STATES } from "~lib/sharedXState/importFlowStates.common"

export const TRAVELOR_API = {
  LOGIN_URL: "https://www.travelor.com",
  GET_SESSION: "https://api.travelor.com/v3/sessions?locale=en",
  GET_HOTELS: "https://api.travelor.com/v3/session"
}

export enum TRAVELOR_SPECIFIC_STATES {}

export const TRAVELOR_CRAWLER_FLOW_STATES = {
  ...TRAVELOR_SPECIFIC_STATES,
  ...IMPORT_FLOW_STATES,
  ...BASE_STATES
}
