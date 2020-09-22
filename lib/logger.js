import { createLogger as createMlabsLogger } from '@meltwater/mlabs-logger'

const name = process.env.LOG_NAME
const level = process.env.LOG_LEVEL || 'info'
const isDev = process.env.IS_OFFLINE || process.env.IS_LOCAL

const envBase = {
  '@env': process.env.LOG_ENV,
  '@service': process.env.LOG_SERVICE,
  '@system': process.env.LOG_SYSTEM,
  version: process.env.LOG_VERSION
}

export function createLogger(preCtx = {}) {
  return createMlabsLogger({
    name,
    level,
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
