import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

const createHandlerFactory = (parser, serializer, getCtx) => (
  configurationRequests,
  createFactories,
  createProcessor
) => async (event, context) => {
  const ctx = getCtx(event, context)
  const config = await getConfig(configurationRequests, ctx)
  const factories = createFactories(config, ctx)
  const processor = createProcessor(factories, ctx)
  const wrap = createWrapper(parser, serializer, ctx)
  const handle = wrap(processor)
  return handle(event, context)
}

const getConfig = async () => ({})

const getUniversalCtx = (event, context) => {
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

const createWrapper = (parser, serializer, ctx) => (processor) => async (
  event,
  context
) => {
  const { log } = ctx
  try {
    log.info({ meta: event }, 'start: handle')
    const parsedEvent = parser(event, context)
    const data = await processor(parsedEvent, context)
    log.debug({ data }, 'data: handle')
    const serializedData = serializer(data)
    log.info('end: handle')
    return serializedData
  } catch (err) {
    log.error({ err }, 'fail: handle')
    throw err
  }
}

const identity = (data) => data

export const createJsonHandler = createHandlerFactory(
  identity,
  identity,
  getUniversalCtx
)
