import { getEventType } from './get-event-type'
import { getRequestId } from './get-request-id'

export function createPreCtx(event, context) {
  const eventType = getEventType(event)
  const reqId = getRequestId({ event, eventType })

  return {
    awsRequestId: context.awsRequestId,
    eventType,
    reqId
  }
}
