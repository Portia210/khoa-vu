import { BASE_STATES } from "~lib/sharedXState/baseStates.common"
import { IMPORT_FLOW_STATES } from "~lib/sharedXState/importFlowStates.common"

export const BOOKING_API = {
  LOGIN_URL: "https://www.travelor.com",
}

export const BOOKING_CONFIG = {
  BEARER_TOKEN: "Bearer Nv2uH1uSSo2XCZratnQcBoUIrPkwrrMEQsCc4zz6"
}
export enum BOOKING_SPECIFIC_STATES {}

export const BOOKING_CRAWLER_FLOW_STATES = {
  ...BOOKING_SPECIFIC_STATES,
  ...IMPORT_FLOW_STATES,
  ...BASE_STATES
}
