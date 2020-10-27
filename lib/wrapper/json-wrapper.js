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
    log.info({ meta: event }, 'start: handler')
    const parsedEvent = parser(event, context)
    log.info({ meta: parsedEvent }, 'parsed: handler')
    const statusCodeAndData = await processor(parsedEvent, context)
    log.debug({ data: statusCodeAndData }, 'unserialized: handler')
    const serializedResponse = multiStatusCodeJsonSerializer(
      statusCodeAndData,
      ctx
    )
    log.debug({ data: serializedResponse }, 'serialized: handler')
    return serializedResponse
  } catch (err) {
    log.error({ err }, 'fail: handler')
    return {
      statusCode: err.statusCode || 500,
      body: {
        error: {
          message: err.message || 'Internal Server Error'
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': reqId
      }
    }
  }
}
