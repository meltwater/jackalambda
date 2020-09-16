import cacheManager from 'cache-manager'
import { getConfig } from './get-config'
import { createWrapper } from './wrapper'

export const createHandlerFactory = (parser, serializer, getCtx) => ({
  configurationRequests,
  createFactories,
  createProcessor
}) => {
  const cache = cacheManager.caching({ ttl: 60 })
  return async (event, context) => {
    const ctx = getCtx(event, context)
    const config = await getConfig(configurationRequests, cache, ctx)
    const factories = createFactories(config, ctx)
    const processor = createProcessor(factories, ctx)
    const wrap = createWrapper(parser, serializer, ctx)
    const handle = wrap(processor)
    return handle(event, context)
  }
}
