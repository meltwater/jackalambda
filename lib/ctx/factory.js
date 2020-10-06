import { createLogger, logFatal } from '../logger'
import { annotateRequest } from '../aws'
import { createPreCtx } from './pre-ctx'

class Ctx {
  constructor({ awsRequestId, eventType, functionName, log, reqId }) {
    this.awsRequestId = awsRequestId
    this.eventType = eventType
    this.functionName = functionName
    this.log = log
    this.reqId = reqId
    Object.freeze(this)
  }
}

/**
 * Create the global context with a logger
 * @private
 *
 * @param {Object} event - The event passed to lambda
 * @param {Object} context - The lambda runtime context
 * @param {Object} [t] - Optional for if running in ava
 *
 * @returns {Ctx} - The new context
 */
export function createCtx(event, context, t) {
  try {
    const preCtx = createPreCtx(event, context)
    const log = createLogger(preCtx, t)
    annotateRequest(preCtx)

    return new Ctx({
      ...preCtx,
      log
    })
  } catch (err) {
    logFatal(err, 'create ctx')
    throw err
  }
}
