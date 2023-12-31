import {
  AuthState,
  DataSourceState,
  DataState,
  ImportState
} from "~lib/dataStores/types/dataImporterState"

export enum BASE_STATES {
  AUTHENTICATION_CANCELLED = "authenticationCancelled",
  AUTHENTICATION_ERROR = "authenticationError",
  DISABLED = "disabled",
  ENABLED = "enabled",
  REQUESTING_PERMISSION = "requestingPermission",
  SWITCH = "switch" // switch state to transition between states
}

const disabledState = {
  [BASE_STATES.DISABLED]: {
    meta: {
      importState: ImportState.DISABLED,
      dataSourceState: DataSourceState.DISABLED
    }
  }
}

const enabledState = {
  [BASE_STATES.ENABLED]: {
    meta: {
      importState: ImportState.ENABLED,
      dataSourceState: DataSourceState.ENABLED,
      dataState: DataState.NO_DATA
    }
  }
}

const requestingPermissionState = {
  [BASE_STATES.REQUESTING_PERMISSION]: {
    meta: {
      importState: ImportState.AUTH_STARTED,
      authState: AuthState.PENDING_AUTH,
      dataSourceState: DataSourceState.ENABLED
    }
  }
}

const authenticationErrorState = {
  [BASE_STATES.AUTHENTICATION_ERROR]: {
    meta: {
      importState: ImportState.ENABLED,
      authState: AuthState.PENDING_AUTH,
      dataSourceState: DataSourceState.ENABLED
    }
  }
}

const authenticationCancelledState = {
  [BASE_STATES.AUTHENTICATION_CANCELLED]: {
    meta: {
      importState: ImportState.ENABLED,
      authState: AuthState.PENDING_AUTH,
      dataSourceState: DataSourceState.ENABLED
    }
  }
}

export const baseSharedStates = {
  ...disabledState,
  ...enabledState,
  ...requestingPermissionState,
  ...authenticationErrorState,
  ...authenticationCancelledState
}
