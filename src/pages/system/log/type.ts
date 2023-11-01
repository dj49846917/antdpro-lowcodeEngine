export type LogData = {
  logId?: string,
  traceId?: string,
  modules?: string,
  eventName?: string,
  requestType?: string,
  requestUrl?: string,
  source?: string,
  eventDate?: string,
  dealTime?: string,
  userId?: string,
  [key: string]: any
}