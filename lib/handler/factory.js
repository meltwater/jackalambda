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
  const processor = createProcessor(factories)
  const handle = wrap(parser, serializer, processor, ctx)
  return handle(event, context)
}

const getConfig = async () => ({})

const getUniversalCtx = (event, context) => {
  const reqId = uuidv4()
  const { awsRequestId } = context

  const base = { reqId, awsRequestId }
  const log = createLogger({ base })

  return {
    reqId,
    awsRequestId,
    log
  }
}

const wrap = (parser, serializer, processor, ctx) => async (event, context) => {
  const { log } = ctx
  try {
    const parsedEvent = parser(event, context)
    log.info({ meta: event }, 'start: handle')
    const data = await processor(parsedEvent, context)
    log.debug({ data }, 'end: handle')
    const serializedData = serializer(data)
    return serializedData
  } catch (err) {
    log.error({ err }, 'fail: handle')
    throw err
  }
}

const fromJson = (data) => JSON.parse(data)
const identity = (data) => data

export const createJsonHandler = createHandlerFactory(
  fromJson,
  identity,
  getUniversalCtx
)
