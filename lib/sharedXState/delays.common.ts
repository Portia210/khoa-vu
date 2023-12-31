import { DataImporterContext } from '@/importers/framework/dataImporter/context';
import { IMPORT_FLOW_DELAYS } from './importFlowStates.common';

export const commonDelays = {
  delays: {
    [IMPORT_FLOW_DELAYS.NEXT_IMPORT_RUN_INTERVAL]: (context: DataImporterContext) => {
      return context.intervalMs;
    },
  },
};
