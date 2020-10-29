import { createHandler } from './factory'

/**
 * A handler designed for direct lambda invocations that respond with a JSON serializable object.
 * Takes identical options as createHandler, however the serializer and parser
 * options will always be overridden with the identity function.
 *
 * @param {*} options - Takes identical options as createHandler, however the serializer and parser options will always be overridden with the identity function.
 */
export const createJsonHandler = (options) =>
  createHandler({
    ...options,
    serializer: identity,
    parser: identity
  })

const identity = (data) => data
