import type { PubSubPublishParam } from '@/importers/framework/pubSubController/types';
import { dataImporterDataStore } from '@/dataStores/dataImporterDataStore';
import type { AnyState, StateMachine } from 'xstate';
import { State, interpret } from 'xstate';
import { PubSubController } from '@/importers/framework/pubSubController';
import { PUBSUB_MESSAGES } from '@/importers/framework/pubSubController/types/messages';
import { DataSourceType } from '@/constants/dataSources';
import { DataImporterContext } from './context';

import {
  AuthState,
  ImportState,
  DataState,
  DataSourceState,
  ErrorState,
  DataImporterState,
} from '@/dataStores/types/dataImporterState';
import { errorLogger } from '@/importers/framework/errorLogger';
import { IMPORT_FLOW_STATES } from '@/importers/sharedXState/importFlowStates.common';
import { ImportFlow } from './types/importFlowType';

/**
 * An abstract class responsible for loading data source import state machine and run it
 */
export abstract class DataImporter extends PubSubController {
  public dataSourceName!: DataSourceType;
  private startImportEvent: string | undefined;

  private importState: ImportState = ImportState.DISABLED;
  private dataSourceState: DataSourceState = DataSourceState.DISABLED;
  private authState!: AuthState;
  private dataState!: DataState;
  public identifier!: string;
  private importService: any;
  public flowType!: ImportFlow;

  constructor(
    dataSourceName: DataSourceType,
    identifier: string,
    startImportEvent?: string,
    flowType: ImportFlow = ImportFlow.NORMAL_FLOW
  ) {
    super();
    Object.assign(this, {
      dataSourceName,
      identifier,
      startImportEvent,
      flowType,
    });
  }

  /**
   * Must override by inheritors, fetch configuration data if needed
   * If there is no configuration used, just override and return true/false
   */
  abstract fetchConfiguration(): Promise<boolean>;

  /**
   * Must override by inheritors, return the actual import state machine for that data source
   */
  abstract initializeImportMachine(): StateMachine<DataImporterContext, any, any>;

  /**
   * Initialize the importer = fetch configuration and subscribe to import message(s)
   */
  async initialize() {
    await this.fetchConfiguration();

    this.subscribe(`${PUBSUB_MESSAGES.RESUME}.${this.dataSourceName}`, this.resume.bind(this));

    this.subscribe(
      `${PUBSUB_MESSAGES.START_AUTHENTICATION}.${this.dataSourceName}`,
      this.startAuthentication.bind(this)
    );

    this.subscribe(`${PUBSUB_MESSAGES.IMPORT}.${this.dataSourceName}`, this.import.bind(this));

    this.subscribe(
      `${PUBSUB_MESSAGES.AUTHENTICATION_ERROR}.${this.dataSourceName}`,
      this.sendAuthenticationEvent.bind(this)
    );

    this.subscribe(
      `${PUBSUB_MESSAGES.AUTHENTICATION_CANCELLED}.${this.dataSourceName}`,
      this.sendAuthenticationEvent.bind(this)
    );

    this.subscribe(
      `${PUBSUB_MESSAGES.START_UPLOAD}.${this.dataSourceName}`,
      this.sendStartUpload.bind(this)
    );

    this.subscribe(
      `${PUBSUB_MESSAGES.UPLOAD}.${this.dataSourceName}`,
      this.sendUploadEvent.bind(this)
    );

    this.subscribe(
      `${PUBSUB_MESSAGES.PENDING_UPLOAD}.${this.dataSourceName}`,
      this.sendPendingUploadEvent.bind(this)
    );

    this.subscribe(
      `${PUBSUB_MESSAGES.REQUEST_DATA}.${this.dataSourceName}`,
      this.sendRequestData.bind(this)
    );

    this.subscribe(
      `${PUBSUB_MESSAGES.CONFIRM_DATA_REQUEST_EMAIL}.${this.dataSourceName}`,
      this.sendConfirmDataRequestEmailEvent.bind(this)
    );

    this.subscribe(
      `${PUBSUB_MESSAGES.UPDATE_SCHEDULE_IMPORT}.${this.dataSourceName}`,
      this.updateScheduleImport.bind(this)
    );

    this.subscribe(
      `${PUBSUB_MESSAGES.REQUEST_EMAIL_AUTHENTICATION}.${this.dataSourceName}`,
      this.sendRequestEmailAuthentication.bind(this)
    );
  }

  /**
   * Resume current machine if available
   */
  private async resume() {
    if (this.importService) {
      console.log('Import Service already existed');
      return;
    }

    /* Start the state machine with the context */
    let importMachine = this.initializeImportMachine();

    const importService = interpret(importMachine).onTransition(this.onTransition.bind(this));
    const version = importMachine.version;

    let initialState: AnyState = importMachine.initialState;

    const persitedStateData = await dataImporterDataStore.states.get(this.dataSourceName);

    if (persitedStateData && (!version || persitedStateData?.machineVersion === version)) {
      /* Restore the machine from a previous state */
      try {
        initialState = State.create(JSON.parse(persitedStateData?.currentState));
      } catch (error) {
        initialState = importMachine.initialState;
      }
    }

    try {
      importService.start(initialState);
      this.importService = importService;
    } catch (error) {
      console.error('Error starting state machine:', this.dataSourceName, error);
      errorLogger.captureException(error);
    }
  }

  private async startAuthentication(message: string, data: PubSubPublishParam) {
    const context = data.context;
    await this.resume();
    // clean up retry count when start
    if (context) {
      context.confirmDataRetryCount = undefined;
      context.requestDataRetryCount = undefined;
    }
    this.importService.send(PUBSUB_MESSAGES.START_AUTHENTICATION, context);
  }

  /**
   * Import handle, will be execute when the message arrive
   * @param message string
   * @param data PubSubPublishParam
   */
  /* Change this function to accept a context for the state machine */
  private async import(message: string, data: PubSubPublishParam) {
    /* May check the correct message, no need for now */
    const context = data.context;
    await this.resume();
    if (this.startImportEvent) this.importService.send(this.startImportEvent, context);
  }

  private async sendAuthenticationEvent() {
    await this.resume();
    this.importService.send(PUBSUB_MESSAGES.AUTHENTICATION_CANCELLED);
  }

  private async sendPendingUploadEvent() {
    await this.resume();
    this.importService.send(PUBSUB_MESSAGES.PENDING_UPLOAD);
  }

  private async sendStartUpload(message: string, data: PubSubPublishParam) {
    const context = data.context;
    await this.resume();
    this.importService.send(PUBSUB_MESSAGES.START_UPLOAD, context);
  }

  private async sendUploadEvent(message: string, data: PubSubPublishParam) {
    const context = data.context;
    await this.resume();
    this.importService.send(PUBSUB_MESSAGES.UPLOAD, context);
  }

  private async sendRequestData(message: string, data: PubSubPublishParam) {
    const context = data.context;
    await this.resume();
    this.importService.send(PUBSUB_MESSAGES.REQUEST_DATA, context);
  }

  private async sendConfirmDataRequestEmailEvent(message: string, data: PubSubPublishParam) {
    const context = data.context;
    await this.resume();
    this.importService.send(PUBSUB_MESSAGES.CONFIRM_DATA_REQUEST_EMAIL, context);
  }

  private async sendRequestEmailAuthentication() {
    await this.resume();
    this.importService.send(PUBSUB_MESSAGES.REQUEST_EMAIL_AUTHENTICATION);
  }

  private async updateScheduleImport(message: string, data: PubSubPublishParam) {
    const context = data.context;
    await this.resume();

    const currentState = this.importService.state;
    if (currentState.matches(IMPORT_FLOW_STATES.WAIT_FOR_NEXT_IMPORT)) {
      this.importService.send(PUBSUB_MESSAGES.UPDATE_SCHEDULE_IMPORT, context);
    }
  }

  /**
   * Save the machine state after each transition
   * @param state AnyState
   */
  async onTransition(state: AnyState): Promise<void> {
    if (!state.changed) return; /* Only persist the state when it done transition */

    const currentState = JSON.stringify(state);
    const { importState, dataSourceState, authState, dataState, errorState, errorMsg } =
      Object.keys(state.meta).reduce(
        (_, key) => {
          const { importState, dataSourceState, authState, dataState, errorState } =
            state.meta[key];
          const errorMsg =
            errorState === ErrorState.ERROR
              ? state.context.errorMsg ?? state.meta.errorMsg
              : undefined;
          return { importState, dataSourceState, authState, dataState, errorState, errorMsg };
        },
        {
          importState: undefined,
          dataSourceState: undefined,
          authState: undefined,
          dataState: undefined,
          errorState: undefined,
          errorMsg: undefined,
        }
      );

    this.importState = importState || this.importState;
    this.dataSourceState = dataSourceState || this.dataSourceState;
    this.authState = authState || this.authState;
    this.dataState = dataState || this.dataState;

    const currentDataState = await dataImporterDataStore.states.get(this.dataSourceName);

    const dataImportState: DataImporterState = {
      dataSourceName: this.dataSourceName,
      machineVersion: state.machine?.version,
      importState: this.importState,
      dataSourceState: this.dataSourceState,
      authState: this.authState,
      dataState: this.dataState,
      errorState,
      errorMsg,
      currentState,
      lastUpdated: new Date(),
      schedule: currentDataState?.schedule,
    };

    await dataImporterDataStore.states.put(dataImportState);
  }
}
