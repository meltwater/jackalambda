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
 * @param {parser} parser - The parser provided through `createHandler`
 * @returns {wrapper} - The wrapped processor
 */
export const createApiJsonWrapper = (ctx, parser) => (processor) => async (
  event,
  context
) => {
  const { log, reqId } = ctx
  try {
    log.info({ meta: event }, 'handler: start')
    const parsedEvent = parser(event, context)
    log.info({ meta: parsedEvent }, 'handler: parsed')
    const statusCodeAndData = await processor(parsedEvent, context)
    log.debug({ data: statusCodeAndData }, 'handler: unserialized')
    const serializedResponse = multiStatusCodeJsonSerializer(
      statusCodeAndData,
      ctx
    )
    log.debug({ data: serializedResponse }, 'handler: serialized')
    return serializedResponse
  } catch (err) {
    log.error({ err }, 'handler: fail')
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: {
          message: err.message || 'Internal Server Error'
        }
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': reqId
      }
    }
  }
}
