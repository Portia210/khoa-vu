import { TRAVELOR_CRAWLER_FLOW_STATES } from "../constants"

export const switchState = {
  [TRAVELOR_CRAWLER_FLOW_STATES.SWITCH]: {
    always: [
      {
        target: `${TRAVELOR_CRAWLER_FLOW_STATES.IMPORT_COMPLETED}`,
        cond: (context: any, _: any) =>
          context.targetState === TRAVELOR_CRAWLER_FLOW_STATES.IMPORT_COMPLETED
      },
      {
        target: `${TRAVELOR_CRAWLER_FLOW_STATES.AUTHENTICATION_ERROR}`,
        cond: (context: any, _: any) =>
          context.targetState ===
          TRAVELOR_CRAWLER_FLOW_STATES.AUTHENTICATION_ERROR
      },
      {
        target: `${TRAVELOR_CRAWLER_FLOW_STATES.IMPORT}`,
        cond: (context: any, _: any) =>
          context.targetState === TRAVELOR_CRAWLER_FLOW_STATES.IMPORT
      }
      /* TODO: Add any specific states here */
    ]
  }
}
