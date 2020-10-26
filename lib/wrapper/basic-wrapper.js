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
 * @param {serializer} serializer - The serializer provided through `createHandler`
 * @returns {wrapper} - The wrapped processor
 */

export const createBasicWrapper = (ctx, parser, serializer) => (
  processor
) => async (event, context) => {
  const { log } = ctx
  try {
    log.info({ meta: event }, 'start: handle')
    const parsedEvent = parser(event, context)
    const data = await processor(parsedEvent, context)
    log.debug({ data }, 'data: handle')
    const serializedData = serializer(data)
    log.info('end: handle')
    return serializedData
  } catch (err) {
    log.error({ err }, 'fail: handle')
    throw err
  }
}
