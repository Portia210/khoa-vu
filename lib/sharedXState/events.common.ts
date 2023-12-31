
export const commonImporterEvents = {
  on: {
    ENABLE: {
      target: 'enabled',
    },
    START_AUTHENTICATION: {
      target: 'requestingPermission',
    },
    AUTHENTICATION_CANCELLED: {
      target: 'authenticationCancelled',
    },
    AUTHENTICATION_ERROR: {
      target: 'authenticationError',
    },
    IMPORT: {
      target: 'import',
    },
    /* TODO NEXT: Need to refactor these values, -> use the same constants for both PubSub + XState */
    UPDATE_SCHEDULE_IMPORT: {
      target: 'scheduledImport',
    },
  },
};

export const commonUploaderEvents = {
  on: {
    ENABLE: {
      target: 'enabled',
    },
    START_AUTHENTICATION: {
      target: 'requestingPermission',
    },
    AUTHENTICATION_CANCELLED: {
      target: 'authenticationCancelled',
    },
    AUTHENTICATION_ERROR: {
      target: 'authenticationError',
    },
    REQUEST_EMAIL_AUTHENTICATION: {
      target: 'requestEmailAuthentication',
    },
  },
};
