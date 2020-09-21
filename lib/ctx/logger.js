import { createLogger as createMlabsLogger } from '@meltwater/mlabs-logger'

export function createLogger(preCtx) {
  const { awsRequestId, reqId } = preCtx

  const logOutputMode =
    process.env.IS_OFFLINE || process.env.IS_LOCAL ? 'pretty' : 'json'
  const base = { reqId, awsRequestId }
  const log = createMlabsLogger({
    base,
    outputMode: process.env.LOG_OUTPUT_MODE
      ? process.env.LOG_OUTPUT_MODE
      : logOutputMode
  })

  return log
}
