import { createLogger, logFatal } from '../logger'
import { annotateRequest } from '../aws'
import { createPreCtx } from './pre-ctx'

/**
 * The runtime context
 *
 * @param {Object} options - See below
 * @param {string} options.awsRequestId - The awsRequestId for the current invocation
 * @param {string} options.eventType - A string representing the type of event
 * @param {string} options.functionName - The name of the lambda function from lambda context
 * @param {object} options.log - A pino compatible logger
 * @param {string} options.reqId - The distributed tracing id for this invocation
 *
 * @property {string} awsRequestId - The awsRequestId for the current invocation
 * @property {string} eventType - A string representing the type of event
 * @property {string} functionName - The name of the lambda function from lambda context
 * @property {object} log - A pino compatible logger
 * @property {string} reqId - The distributed tracing id for this invocation
 */
export class AppContext {
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
 * @param {Object} [t] - Optional for if running in AVA
 *
 * @returns {AppContext} - The new context
 */
export function createCtx(event, context, t) {
  try {
    const preCtx = createPreCtx(event, context)
    const log = createLogger(preCtx, t)
    annotateRequest(preCtx)

    return new AppContext({
      ...preCtx,
      log
    })
  } catch (err) {
    logFatal(err, 'create ctx')
    throw err
  }
}
