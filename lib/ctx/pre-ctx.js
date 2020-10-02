import { getEventType } from './get-event-type'
import { getRequestId } from './get-request-id'

export class PreCtx {
  constructor({ awsRequestId, eventType, functionName, reqId }) {
    this.awsRequestId = awsRequestId
    this.eventType = eventType
    this.functionName = functionName
    this.reqId = reqId
    Object.freeze(this)
  }
}

/**
 * Get basic context information from lambda event and context
 * @param {Object} event - Lambda event
 * @param {Object} context - Lambda context
 *
 * @returns {PreCtx} - The context from just lambda
 */
export function createPreCtx(event, context) {
  const eventType = getEventType(event)
  const reqId = getRequestId({ event, eventType })

  return new PreCtx({
    awsRequestId: context.awsRequestId,
    functionName: context.functionName,
    eventType,
    reqId
  })
}
