import { BASE_URL } from "~lib/constants/enviroment"
import { BASE_STATES } from "~lib/sharedXState/baseStates.common"
import { IMPORT_FLOW_STATES } from "~lib/sharedXState/importFlowStates.common"

export const BOOKING_API = {
  LOGIN_URL: "https://www.booking.com",
  GRAPHQL: "https://www.booking.com/dml/graphql",
  BASE_IMG_URL: "https://cf.bstatic.com",
  SYNC_URL: `${BASE_URL}/api/booking/sync`
}

export const BOOKING_CONFIG = {}

export enum BOOKING_SPECIFIC_STATES {
  CLEAN_UP = "CLEAN_UP"
}

export const BOOKING_CRAWLER_FLOW_STATES = {
  ...BOOKING_SPECIFIC_STATES,
  ...IMPORT_FLOW_STATES,
  ...BASE_STATES
}
