import { multiStatusCodeJsonSerializer } from '../serializer'

/**
 * A processor that uses the provided parser and the multiStatusCodeJsonSerializer
 * The response from the process needs to be in the form:
 * {
 *   statusCode: [number],
 *   data: [JSON serializable object]
 * }
 *
 * @param {object} ctx - Internal use
 * @param {parser=(event)=>event} parser - The parser provided through `createHandler`
 * @param {serializer=multiStatusCodeJsonSerializer} serializer - The serializer provided through `createHandler`
 * @returns {wrapper} - The wrapped processor
 */
export const createApiJsonWrapper = (
  ctx,
  parser = (event) => event,
  serializer = multiStatusCodeJsonSerializer
) => (processor) => async (event, context) => {
  const { log } = ctx
  try {
    log.info({ meta: event }, 'handler: start')
    const parsedEvent = parser(event, context)
    log.info({ meta: parsedEvent }, 'handler: parsed')
    const statusCodeAndData = await processor(parsedEvent, context)
    log.debug({ data: statusCodeAndData }, 'handler: unserialized')
    const serializedResponse = serializer(statusCodeAndData, ctx)
    log.debug({ data: serializedResponse }, 'handler: serialized')
    return serializedResponse
  } catch (err) {
    log.error({ err }, 'handler: fail')
    return serializer(
      {
        statusCode: err.statusCode || 500,
        body: {
          error: {
            message: err.message || 'Internal Server Error'
          }
        }
      },
      ctx
    )
  }
}
