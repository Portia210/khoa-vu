import { create } from "zustand"

import { ImportState } from "~lib/framework/dataStores/types/dataImporterState"
import { travelorCrawlerMediator } from "~lib/mediators/travelorCrawlerMediator"

interface ImportStateStore {
  importState: ImportState
  setImportState: (importState: ImportState) => void
}

const useImportStateStore = create<ImportStateStore>((set) => ({
  importState: ImportState.DISABLED,
  setImportState: (importState: ImportState) => set({ importState })
}))

export { useImportStateStore }

interface TravelorCrawlerStateStore {
  startAuthentication: () => void
}

const useTravelorCrawlerStateStore = create<TravelorCrawlerStateStore>(() => ({
  startAuthentication: () => {
    travelorCrawlerMediator.startAuthentication()
  }
}))

export { useTravelorCrawlerStateStore }
