import cacheManager from 'cache-manager'

import {
  createCtx,
  AppContext // eslint-disable-line no-unused-vars
} from '../ctx'
import { getConfig } from './config'
import { createWrapper } from './wrapper'
import { logFatal } from '../logger'

const identity = (data) => data

/**
 * @callback parser
 * @param {Object} event - The raw lambda event
 * @param {Object} context - The raw lambda context
 * @returns {*} - The parsed event for the processor
 */

/**
 * @callback serializer
 * @param {*} response - The response from the handler to be serialized for lambda response
 * @returns {*} - The serialized lambda response
 */

/**
 * @callback createFactories
 * @param {AppContext} appContext - The context for the current execution of the lambda
 * @param {Object} configuration - The configuration object from the passed configurationRequests
 * @returns {Object} - All of the side effect dependencies in an object
 */

/**
 * @callback createProcessor
 * @param {AppContext} appContext - The context for the current execution of the lambda
 * @param {Object} factories - The response from the createFactories invocation
 * @returns {Object} - All of the side effect dependencies in an object
 */

/**
 * @callback createCache
 * @returns {cacheManager} - An instance of cacheManager
 */

/**
 * @async
 * @callback lambdaHandler
 * @param {object} event - The raw lambda event
 * @param {object} context - The raw lambda context
 *
 * @returns {*} - The result of the processor
 */

/**
 * The entry point for creating handlers
 *
 * @param {Object} options - See below
 * @param {parser} [options.parser=(data)=>data] - A function to parse the incoming lambda event
 * @param {serializer} [options.serializer=(data)=>data] - A function to serialize the response from the lambda invocation
 * @param {Array<ConfigurationRequest>} [options.configurationRequests=[]] - An array of configuration requests to be fulfilled before each invocation of the handler
 * @param {createFactories} [options.createFactories=()=>({})] - A factory function that will return all needed side effect dependencies. Eg. Http
 * @param {createProcessor} options.createProcessor - A factory function that will return the main handler for the lambda
 * @param {createCache} [options.createCache=defaultCache] - A factory function that will return the main handler for the lambda
 * @param {*} [options.t] - For use with Ava during testing
 *
 * @returns {lambdaHandler} - A lambda handler
 */
export function createHandler ({
  parser = identity,
  serializer = identity,
  configurationRequests = [],
  createFactories = () => ({}),
  createCache = createMemoryCache,
  createProcessor,
  t
}) {
  const cache = createCache()
  return async (event, context) => {
    const ctx = createCtx(context, event, t)
    try {
      const config = await getConfig(ctx, configurationRequests, cache)

      const appCtx = { ...ctx, log: ctx.log.child({ isAppLog: true }) }

      const factories = createFactories(appCtx, config)
      const processor = createProcessor(appCtx, factories)
      const wrap = createWrapper(appCtx, parser, serializer)

      const handle = wrap(processor)
      return handle(event, context)
    } catch (err) {
      logFatal(err, 'delegate to wrapped handler')
      throw err
    }
  }
}

const createMemoryCache = () => cacheManager.caching({ ttl: 60 })
