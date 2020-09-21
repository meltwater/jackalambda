import { EventType } from './event-type'
import { getRequestIdSqs } from './get-request-id-sqs'
import { getRequestIdHttp } from './get-request-id-http'

export function getRequestId({ event, eventType }) {
  if (eventType === EventType.sqs) return getRequestIdSqs(event)
  if (eventType === EventType.apiGatewayAwsProxy) return getRequestIdHttp(event)
  if (eventType === EventType.lambda) return event.reqId
  throw new Error('The event type provided is not supported')
}
