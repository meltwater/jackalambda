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
    log.info({ meta: event }, 'start: createApiJsonWrapper')
    const parsedEvent = parser(event, context)
    const statusCodeAndData = await processor(parsedEvent, context)
    log.debug({ data: statusCodeAndData }, 'data: createApiJsonWrapper')
    const serializedResponse = multiStatusCodeJsonSerializer(
      statusCodeAndData,
      ctx
    )
    log.debug({ data: serializedResponse }, 'end: createApiJsonWrapper')
    return serializedResponse
  } catch (err) {
    log.error({ err }, 'fail: createApiJsonWrapper')
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
