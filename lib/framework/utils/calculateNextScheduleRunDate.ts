import dayjs from "dayjs"

import type { DATA_SOURCES } from "~lib/constants/dataSources"
import { dataImporterDataStore } from "~lib/dataStores/dataImporterDataStore"

import type { ScheduleUnit } from "../dataImporter/types/scheduleUnit"

export const calculateNextScheduleRunDate = (
  scheduleInterval: number,
  scheduleUnit: ScheduleUnit
): Date => {
  return dayjs(Date.now()).add(scheduleInterval, scheduleUnit).toDate()
}

export const calculateNextScheduleRunIntervalFromNow = async (
  dataSource: DATA_SOURCES
): Promise<{ scheduledImport: boolean; intervalMs: number }> => {
  const importerState = await dataImporterDataStore.states.get(dataSource)
  if (
    !importerState ||
    !importerState.schedule ||
    !importerState.schedule.scheduleInterval ||
    !importerState.schedule.scheduleUnit
  ) {
    return { scheduledImport: false, intervalMs: 0 }
  }

  const { scheduleInterval, scheduleUnit, overwrite, nextScheduledRun } =
    importerState.schedule
  const newScheduledRun =
    overwrite || !nextScheduledRun
      ? calculateNextScheduleRunDate(scheduleInterval, scheduleUnit)
      : nextScheduledRun

  importerState.schedule = {
    ...importerState.schedule,
    nextScheduledRun: newScheduledRun,
    overwrite:
      false /* To indicates that the next scheduled run was updated, next calculation (if called) don't overwrite the nextScheduledRun if not explicit asked to do so */
  }

  await dataImporterDataStore.states.put(importerState)

  return {
    scheduledImport: true,
    intervalMs: newScheduledRun.getTime() - Date.now()
  }
}
