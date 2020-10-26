import { createJsonWrapper } from '../wrapper/json-wrapper'
import { createHandler } from './factory'

/**
 * A handler designed for lambda invocations through api gateway that respond with a JSON serializable object.
 * Takes identical options as createHandler, however the serializer and wrapper
 * options will always be overridden with the multi-status code versions.
 *
 * See the following:
 * - {@link createJsonWrapper}
 * - {@link multiStatusCodeJsonSerializer}
 * - {@link MultiStatusJsonResponse}
 *
 * @param {*} options - Takes identical options as createHandler, however the serializer and wrapper options will always be overridden with the multi-status code versions.
 */
export const createApiJsonHandler = (options) =>
  createHandler({
    ...options,
    parser: identity,
    wrapper: createJsonWrapper
  })

const identity = (data) => data
