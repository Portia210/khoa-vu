export type WorkerMessage = {
  type: string
  dataSource: string
  tabId?: number,
  requestToken?: string
  access_token?: string
}

export enum ImportMediatorType {
  Direct = "direct",
  ServiceWorker = "serviceWorker"
}
