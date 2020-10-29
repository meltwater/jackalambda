import cacheManager from 'cache-manager'

import {
  createCtx,
  AppContext // eslint-disable-line no-unused-vars
} from '../ctx'
import { getConfig } from './config'
import { createDefaultWrapper } from '../wrapper'
import { logFatal } from '../logger'

/**
 * @callback parser
 * @param {Object} event - The raw lambda event
 * @param {Object} context - The raw lambda context
 * @returns {*} - The parsed event for the processor
 */

/**
 * @callback processor
 * @param {*} parsedEvent - The parsed event output from the `parser`
 * @returns {*} - The serialized lambda response
 */

/**
 * @callback serializer
 * @param {*} response - The response from the handler to be serialized for lambda response
 * @returns {*} - The serialized lambda response
 */

/**
 * @callback wrapper
 * @param {processor} response - The response from the handler to be serialized for lambda response
 * @returns {Function} - The processor wrapped in any additional code you may want
 */

/**
 * @callback createContainer
 * @param {AppContext} appContext - The context for the current execution of the lambda
 * @param {Object} configuration - The configuration object from the passed configurationRequests
 * @returns {Object} - All of the side effect dependencies in an object
 */

/**
 * @callback createProcessor
 * @param {AppContext} appContext - The context for the current execution of the lambda
 * @param {Object} container - The response from the createContainer invocation
 * @returns {Object} - All of the side effect dependencies in an object
 */

/**
 * @callback createCache
 * @returns {cacheManager} - An instance of cacheManager
 */

/**
 * @callback createWrapper
 * @param {AppContext} appContext - The context for the current execution of the lambda
 * @param {parser} parser - The parser provided to `createHandler`
 * @param {serializer} serializer - The serializer provided to `createHandler`
 * @returns {wrapper} - All of the side effect dependencies in an object
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
 * @param {parser} [options.parser] - An optional function to parse the incoming lambda event
 * @param {serializer} [options.serializer] - An optional function to serialize the response from the lambda invocation
 * @param {Array<ConfigurationRequest>} [options.configurationRequests=[]] - An array of configuration requests to be fulfilled before each invocation of the handler
 * @param {createContainer} [options.createContainer=()=>({})] - A factory function that will return all needed side effect dependencies. Eg. Http
 * @param {createProcessor} options.createProcessor - A factory function that will return the main handler for the lambda
 * @param {createCache} [options.createCache=defaultCache] - An instance of cacheManager. Will be used to cache configuration.
 * @param {createWrapper} [options.createWrapper=createDefaultWrapper] - A factory function that will return the processor wrapped in additional functionality
 * @param {*} [options.t] - For use with AVA during testing
 *
 * @returns {lambdaHandler} - A lambda handler
 */
export function createHandler({
  parser,
  serializer,
  configurationRequests = [],
  createContainer = () => ({}),
  createCache = createMemoryCache,
  createWrapper = createDefaultWrapper,
  createProcessor,
  t
}) {
  const cache = createCache()
  return async (event, context) => {
    const ctx = createCtx(event, context, t)
    try {
      const config = await getConfig(ctx, configurationRequests, cache)

      const appCtx = { ...ctx, log: ctx.log.child({ isAppLog: true }) }

      const container = createContainer(appCtx, config)
      const processor = createProcessor(appCtx, container)
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
