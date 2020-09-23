import cacheManager from 'cache-manager'

import { createCtx } from '../ctx'
import { getConfig } from './config'
import { createWrapper } from './wrapper'
import { logFatal } from '../logger'

const identity = (data) => data

export const createHandlerFactory = ({
  parser = identity,
  serializer = identity
} = {}) => ({
  configurationRequests,
  createFactories,
  createProcessor,
  createCache = createMemoryCache,
  t
}) => {
  const cache = createCache()
  return async (event, context) => {
    const ctx = createCtx(event, context, t)
    try {
      const config = await getConfig(configurationRequests, cache, ctx)

      const appCtx = { ...ctx, log: ctx.log.child({ isAppLog: true }) }

      const factories = createFactories(config, appCtx)
      const processor = createProcessor(factories, appCtx)
      const wrap = createWrapper(parser, serializer, appCtx)

      const handle = wrap(processor)
      return handle(event, context)
    } catch (err) {
      logFatal(err, 'delegate to wrapped handler')
      throw err
    }
  }
}

const createMemoryCache = () => cacheManager.caching({ ttl: 60 })
