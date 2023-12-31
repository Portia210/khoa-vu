import type { DataSourceType } from "~lib/constants/dataSources";

/**
 * Import types
 */
export enum ImportType {
  ONE_TIME = 'onetime',
  POLLING = 'polling',
}

/**
 * Import states
 */
export enum ImportState {
  AUTH_STARTED = 'auth-started',
  COMPLETED = 'completed',
  CRITICAL_ERROR = 'critical-error',
  DISABLED = 'disabled',
  ENABLED = 'enabled',
  IMPORTING = 'importing',
  PENDING_AUTH_LOGIN = 'pending-auth-login',
  PENDING_UPLOAD = 'pending-upload',
  REQUEST_EMAIL_AUTHENTICATION = 'request-email-authentication',
  RETRY_IMPORT = 'retry-import',
  UPLOADING = 'uploading',
  UPLOAD_FILE_READY = 'upload-file-ready',
}

/**
 * Data Importer State
 */
export interface DataImporterState {
  dataSourceName: DataSourceType;
  importState: ImportState /* Keep our current internal import state */;
  lastUpdated: Date;
  dataSourceState?: DataSourceState;
  authState?: AuthState;
  dataState?: DataState;
  errorState?: ErrorState;
  errorMsg?: string;
  machineVersion?: string;
  currentState: string;
  schedule?: ScheduleImportConfig;
}

/**
 * Data Source states
 * https://ariagato.atlassian.net/wiki/spaces/GSE/pages/11436033/Front+End+Data+Source+Status+pre-SDK?focusedCommentId=12615682
 */
export enum DataSourceState {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
}

/**
 * Authorization states
 * https://ariagato.atlassian.net/wiki/spaces/GSE/pages/11436033/Front+End+Data+Source+Status+pre-SDK?focusedCommentId=12615682
 */
export enum AuthState {
  AUTHENTICATED = 'authenticated',
  PENDING_AUTH = 'pendingAuth',
}

/**
 * Data states
 * https://ariagato.atlassian.net/wiki/spaces/GSE/pages/11436033/Front+End+Data+Source+Status+pre-SDK?focusedCommentId=12615682
 */
export enum DataState {
  DATA_RECEIVED = 'dataReceived',
  FETCHING = 'fetching',
  NO_DATA = 'noData',
}

/**
 * Error states
 * https://ariagato.atlassian.net/wiki/spaces/GSE/pages/11436033/Front+End+Data+Source+Status+pre-SDK?focusedCommentId=12615682
 */
export enum ErrorState {
  ERROR = 'error',
}
