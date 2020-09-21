import { EventType } from './event-type'
import { getRequestIdSqs } from './get-request-id-sqs'
import { getRequestIdHttp } from './get-request-id-http'

export function getRequestId({ event, eventType }) {
  switch (eventType) {
    case EventType.sqs:
      return getRequestIdSqs(event)
    case EventType.apiGatewayAwsProxy:
      return getRequestIdHttp(event)
    default:
      throw new Error('The event type provided is not supported')
  }
}
