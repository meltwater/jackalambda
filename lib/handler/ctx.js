import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

export const getUniversalCtx = (event, context) => {
  const reqId = uuidv4()
  const { awsRequestId } = context

  const logOutputMode =
    process.env.IS_OFFLINE || process.env.IS_LOCAL ? 'pretty' : 'json'
  const base = { reqId, awsRequestId }
  const log = createLogger({
    base,
    outputMode: process.env.LOG_OUTPUT_MODE
      ? process.env.LOG_OUTPUT_MODE
      : logOutputMode
  })

  return {
    reqId,
    awsRequestId,
    log
  }
}
