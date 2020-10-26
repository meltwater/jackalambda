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
export const createJsonWrapper = (ctx, parser) => (processor) => async (
  event,
  context
) => {
  const { log } = ctx
  try {
    log.info({ meta: event }, 'start: createJsonWrapper')
    const parsedEvent = parser(event, context)
    const statusCodeAndData = await processor(parsedEvent, context)
    log.debug({ data: statusCodeAndData }, 'data: createJsonWrapper')
    const serializedResponse = multiStatusCodeJsonSerializer(statusCodeAndData)
    log.debug({ data: serializedResponse }, 'end: createJsonWrapper')
    return serializedResponse
  } catch (err) {
    log.error({ err }, 'fail: createJsonWrapper')
    return {
      statusCode: 500,
      data: JSON.stringify(err)
    }
  }
}
