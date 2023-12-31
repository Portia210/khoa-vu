export type ScheduleUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
export type ScheduleImportConfig = {
  scheduleInterval: number;
  scheduleUnit: ScheduleUnit;
  nextScheduledRun?: Date;
  overwrite?: boolean;
};
