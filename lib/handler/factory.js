import cacheManager from 'cache-manager'

import { createCtx } from '../ctx'
import { getConfig } from './config'
import { createWrapper } from './wrapper'

const identity = (data) => data

export const createHandlerFactory = ({
  parser = identity,
  serializer = identity
} = {}) => ({ configurationRequests, createFactories, createProcessor }) => {
  const cache = cacheManager.caching({ ttl: 60 })
  return async (event, context) => {
    const ctx = createCtx(event, context)
    const config = await getConfig(configurationRequests, cache, ctx)
    const factories = createFactories(config, ctx)
    const processor = createProcessor(factories, ctx)
    const wrap = createWrapper(parser, serializer, ctx)
    const handle = wrap(processor)
    return handle(event, context)
  }
}
