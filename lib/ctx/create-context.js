import { getEventType } from './get-event-type'
import { getRequestId } from './get-request-id'

export function createContext(event, lambdaContext) {
  const eventType = getEventType(event)
  const reqId = getRequestId({ event, eventType })

  return {
    awsRequestId: lambdaContext.awsRequestId,
    eventType,
    reqId
  }
}
