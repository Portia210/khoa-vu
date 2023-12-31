/**
 * Type of PubSub subscribe handler
 */
export type PubSubEventHandler<T> = (message: string, data: T) => object | void;

/**
 * Type of PubSub callback
 */
export type PubSubCallback = (data: object) => object | void;

/**
 * Type of PubSub publish parameter
 * It must have an identifier indicate the source publisher
 */
type WithWildcards<T> = T & { [key: string]: any };
export type PubSubPublishParam = WithWildcards<{
  identifier: string;
  live?: boolean;
  context?: Record<string, any>;
}>;

/**
 * Invocation information type
 * token: the token generated when subscribe to a message, use to unsubscribe
 * message: string
 * callback: the handler to be executed when the message arrive
 */
export type InvocationInfo = {
  token: string;
  message: string;
  callback: any;
};
