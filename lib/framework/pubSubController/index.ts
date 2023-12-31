import { PUBSUB_MESSAGES } from './types/messages';
import PubSub from 'pubsub-js';
import type {
  InvocationInfo,
  PubSubCallback,
  PubSubEventHandler,
  PubSubPublishParam,
} from './types';

/**
 * A simple wrapper class for pubsub-js
 * If we want to change the library later, update only one place here, i.e change to Redis PubSub
 * Data source controller extends this instead of directly use the lib
 */
export class PubSubController {
  /**
   * Subscribe to a message with the handler
   * @param message string
   * @param handler PubSubEventHandler
   */
  subscribe(message: string, handler: PubSubEventHandler<PubSubPublishParam>) {
    return PubSub.subscribe(message, handler);
  }

  /**
   * Publish a message with data param
   * Data param must have an identifier value indicate the source
   * @param message string
   * @param data PubSubPublishParam
   */
  publish(message: string, data: PubSubPublishParam) {
    return PubSub.publish(message, data);
  }

  /**
   * The list of all invocation registered to be executed
   */
  private invocationList: { [key: string]: InvocationInfo[] } = {};

  /**
   * Register a callback handler for a specific message
   * @param message string
   * @param callback PubSubEventHandler
   * @param identifier The -should-be-unique identifier
   */
  protected registerCallback(
    message: string,
    callback: PubSubCallback,
    identifier: string
  ): string {
    let token: string;
    const identifiedInvocations = this.invocationList[identifier] || [];
    const currentInvocation = identifiedInvocations.find(
      (invocation) => invocation.message === message
    );

    if (currentInvocation) {
      /* Replace the current callback */
      currentInvocation.callback = callback;
      token = currentInvocation.token;
    } else {
      token = PubSub.subscribe(message, this.executeCallback.bind(this));
      identifiedInvocations.push({ token, message, callback });
      this.invocationList[identifier] = identifiedInvocations;
    }

    return token;
  }

  protected unregisterCallback(identifier: string, token: string) {
    let identifiedInvocations = this.invocationList[identifier] || [];
    const currentInvocation = identifiedInvocations.find(
      (invocation) => invocation.token === token
    );
    if (currentInvocation) {
      const unsubscribeMessage = `${PUBSUB_MESSAGES.UNREGISTER}.${currentInvocation.message}`;

      PubSub.unsubscribe(currentInvocation.token);
      PubSub.publish(unsubscribeMessage, { identifier });
      identifiedInvocations = identifiedInvocations.filter(
        (invocation) => invocation.token !== token
      );
      this.invocationList[identifier] = identifiedInvocations;
    }
  }

  /**
   * Execute the correct callback based on the message and the identifier
   * @param message string
   * @param data PubSubPublishParam
   */
  private executeCallback(message: string, data: PubSubPublishParam) {
    const { identifier } = data;
    const identifiedInvocations = this.invocationList[identifier] || [];
    const currentInvocation = identifiedInvocations.find(
      (invocation) => invocation.message === message
    );
    if (currentInvocation) currentInvocation.callback(data);
  }
}
