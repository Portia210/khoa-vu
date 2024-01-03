import { create } from "zustand"

import { ImportState } from "~lib/framework/dataStores/types/dataImporterState"
import { bookingCrawlerMediator } from "~lib/mediators/bookingCrawlerMediator"

interface ImportStateStore {
  importState: ImportState
  setImportState: (importState: ImportState) => void
}

const useImportStateStore = create<ImportStateStore>((set) => ({
  importState: ImportState.DISABLED,
  setImportState: (importState: ImportState) => set({ importState })
}))

export { useImportStateStore }

interface BookingCrawlerStateStore {
  startAuthentication: () => void
}

const useBookingCrawlerStateStore = create<BookingCrawlerStateStore>(() => ({
  startAuthentication: () => {
    bookingCrawlerMediator.startAuthentication()
  }
}))

export { useBookingCrawlerStateStore }
