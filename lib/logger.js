import { PreCtx } from './ctx/pre-ctx' // eslint-disable-line no-unused-vars
import { createLogger as createMlabsLogger } from '@meltwater/mlabs-logger'

const name = process.env.LOG_NAME
const level = process.env.LOG_LEVEL || 'info'
const isDev = process.env.IS_OFFLINE || process.env.IS_LOCAL

const envBase = {
  isAppLog: false,
  '@env': process.env.LOG_ENV,
  '@service': process.env.LOG_SERVICE,
  '@system': process.env.LOG_SYSTEM,
  version: process.env.LOG_VERSION
}

/**
 * Create a logger based on the Lambda Context
 * @param {PreCtx} preCtx - The Pre-context for the Lambda Event
 * @param {any} t - Used for when testing with Ava
 * @returns {Object} - A pino compatible logger with settings and a base context filled in
 */
export function createLogger(preCtx = {}, t) {
  return createMlabsLogger({
    name,
    level,
    t,
    outputMode: isDev ? 'pretty' : 'json',
    base: createBase(preCtx)
  })
}

const createBase = ({ awsRequestId, functionName, reqId }) => {
  if (isDev) return {}
  return {
    ...envBase,
    awsRequestId,
    functionName,
    reqId
  }
}

/**
 * A function for logging before the context aware logger could be created
 * @param {Error} err - The error that occurred
 * @param {string} msg - The message for the error
 *
 * @returns {void}
 */
export const logFatal = (err, msg) => {
  try {
    const fatalLog = createLogger()
    fatalLog.fatal({ err }, `Failed to ${msg}`)
  } catch {
    const log = createMlabsLogger()
    log.fatal({ err }, `Failed to ${msg} and failed to create valid logger`)
    throw err
  }
}
