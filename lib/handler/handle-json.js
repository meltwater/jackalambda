import { createHandler } from './factory'

/**
 * A handler designed for direct lambda invocations that respond with JSON a object
 *
 * @param {object} options - See below
 * @param {Array<ConfigurationRequest>} [options.configurationRequests=[]] - An array of configuration requests to be fulfilled before each invocation of the handler
 * @param {createContainer} [options.createContainer=()=>({})] - A factory function that will return all needed side effect dependencies. Eg. Http
 * @param {createProcessor} options.createProcessor - A factory function that will return the main handler for the lambda
 * @param {createCache} [options.createCache=defaultCache] - A factory function that will return the main handler for the lambda
 * @param {*} [options.t] - For use with Ava during testing
 */
export const createJsonHandler = ({
  configurationRequests,
  createContainer,
  createProcessor,
  createCache,
  t
}) => createHandler({
  configurationRequests,
  createContainer,
  createProcessor,
  createCache,
  t
})
