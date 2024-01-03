import { BOOKING_CRAWLER_FLOW_STATES } from "../constants"

export const switchState = {
  [BOOKING_CRAWLER_FLOW_STATES.SWITCH]: {
    always: [
      {
        target: `${BOOKING_CRAWLER_FLOW_STATES.IMPORT_COMPLETED}`,
        cond: (context: any, _: any) =>
          context.targetState === BOOKING_CRAWLER_FLOW_STATES.IMPORT_COMPLETED,
      },
      {
        target: `${BOOKING_CRAWLER_FLOW_STATES.AUTHENTICATION_ERROR}`,
        cond: (context: any, _: any) =>
          context.targetState ===
          BOOKING_CRAWLER_FLOW_STATES.AUTHENTICATION_ERROR
      },
      {
        target: `${BOOKING_CRAWLER_FLOW_STATES.IMPORT}`,
        cond: (context: any, _: any) =>
          context.targetState === BOOKING_CRAWLER_FLOW_STATES.IMPORT_COMPLETED
      }

      /* TODO: Add any specific states here */
    ]
  }
}
