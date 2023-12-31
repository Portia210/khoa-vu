import {
  ImportState,
  AuthState,
  DataState,
  ErrorState,
  DataSourceState,
} from '@/dataStores/types/dataImporterState';
import { baseSharedStates } from './baseStates.common';

export enum REQUEST_EMAIL_AUTHENTICATION_STATES {
  REQUEST_EMAIL_AUTHENTICATION = 'requestEmailAuthentication',
  REQUEST_EMAIL_AUTHENTICATION_ERROR = 'requestEmailAuthenticationError',
}

export enum REQUEST_DATA_STATES {
  REQUEST_DATA = 'requestData',
  REQUEST_DATA_ERROR = 'requestDataError',
  REQUEST_DATA_RETRY = 'requestDataRetry',
  REQUEST_DATA_SUCCESS_CHECK = 'requestDataSuccessCheck',
  REQUEST_DATA_SWITCH = 'requestDataSwitch',
}

export enum CONFIRM_DATA_REQUEST_STATES {
  CONFIRM_DATA_ERROR = 'confirmDataError',
  CONFIRM_DATA_REQUEST = 'confirmDataRequest',
  CONFIRM_DATA_REQUEST_CHECK = 'confirmDataRequestCheck',
  CONFIRM_DATA_SWITCH = 'confirmDataSwitch',
}

export enum PENDING_UPLOAD_DATA_STATES {
  PENDING_UPLOAD = 'pendingUpload',
  SCHEDULE_NEXT_CHECK_UPLOAD_FILE_READY = 'scheduleNextCheckUploadFileReady',
  UPLOAD_FILE_READY = 'uploadFileReady',
  UPLOAD_FILE_READY_CHECK = 'uploadFileReadyCheck',
}

export enum UPLOAD_DATA_STATES {
  UPLOAD = 'upload',
  UPLOAD_COMPLETED = 'uploadCompleted',
  UPLOAD_ERROR = 'uploadError',
  UPLOAD_HANDLE_EMAIL_LINK = 'uploadHandleEmailLink',
  UPLOAD_WAIT_FOR_FILE_URL = 'uploadWaitForFileUrl',
}

export const UPLOAD_FLOW_STATES = {
  ...REQUEST_EMAIL_AUTHENTICATION_STATES,
  ...REQUEST_DATA_STATES,
  ...CONFIRM_DATA_REQUEST_STATES,
  ...PENDING_UPLOAD_DATA_STATES,
  ...UPLOAD_DATA_STATES,
};

const requestEmailAuthenticationState = {
  [UPLOAD_FLOW_STATES.REQUEST_EMAIL_AUTHENTICATION]: {
    meta: {
      importState: ImportState.REQUEST_EMAIL_AUTHENTICATION,
      authState: AuthState.AUTHENTICATED,
      dataSourceState: DataSourceState.ENABLED,
      dataState: DataState.NO_DATA,
    },
  },
};

const uploadFileReadyState = {
  [UPLOAD_FLOW_STATES.UPLOAD_FILE_READY]: {
    // When the file is ready, the user needs to click the upload button to start uploading
    meta: {
      importState: ImportState.UPLOAD_FILE_READY,
      authState: AuthState.AUTHENTICATED,
      dataSourceState: DataSourceState.ENABLED,
      dataState: DataState.NO_DATA,
    },
  },
};

const uploadWaitForFileUrlState = {
  [UPLOAD_FLOW_STATES.UPLOAD_WAIT_FOR_FILE_URL]: {
    meta: {
      importState: ImportState.UPLOADING,
      authState: AuthState.AUTHENTICATED,
      dataSourceState: DataSourceState.ENABLED,
      dataState: DataState.FETCHING,
    },
  },
};

const uploadCompletedState = {
  [UPLOAD_FLOW_STATES.UPLOAD_COMPLETED]: {
    meta: {
      importState: ImportState.COMPLETED,
      dataState: DataState.DATA_RECEIVED,
      dataSourceState: DataSourceState.ENABLED,
    },
  },
};

const uploadErrorState = {
  [UPLOAD_FLOW_STATES.UPLOAD_ERROR]: {
    meta: {
      importState: ImportState.CRITICAL_ERROR,
      errorState: ErrorState.ERROR,
      dataSourceState: DataSourceState.ENABLED,
      errorMsg: 'Error uploading data',
    },
  },
};

const requestDataErrorState = {
  [UPLOAD_FLOW_STATES.REQUEST_DATA_ERROR]: {
    meta: {
      importState: ImportState.CRITICAL_ERROR,
      errorState: ErrorState.ERROR,
      dataSourceState: DataSourceState.ENABLED,
      errorMsg: 'Error requesting data',
    },
  },
};
const confirmDataErrorState = {
  [UPLOAD_FLOW_STATES.CONFIRM_DATA_ERROR]: {
    meta: {
      importState: ImportState.CRITICAL_ERROR,
      errorState: ErrorState.ERROR,
      dataSourceState: DataSourceState.ENABLED,
      errorMsg: 'Error confirming data',
    },
  },
};

export const commonUploadFlowStates = {
  ...baseSharedStates,
  ...requestEmailAuthenticationState,
  ...requestDataErrorState,
  ...confirmDataErrorState,
  ...uploadFileReadyState,
  ...uploadCompletedState,
  ...uploadErrorState,
  ...uploadWaitForFileUrlState,
};
