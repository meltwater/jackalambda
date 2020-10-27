/**
 * A wrapper that handles top level logging/parsing/serialization orchestration

 * @param {object} ctx - Internal use
 * @param {parser} parser - The parser provided through `createHandler`
 * @param {serializer} serializer - The serializer provided through `createHandler`
 * @returns {wrapper} - The wrapped processor
 */

export const createDefaultWrapper = (ctx, parser, serializer) => (
  processor
) => async (event, context) => {
  const log = ctx.log.child({ meta: event, jackalambdaWrapper: 'default' })
  try {
    log.info({ meta: event }, 'start: handler')
    const parsedEvent = parser(event, context)
    log.info({ meta: parsedEvent }, 'parsed: handler')
    const data = await processor(parsedEvent, context)
    log.debug({ data }, 'unserialized: handler')
    const serializedData = serializer(data, ctx)
    log.debug({ data: serializedData }, 'serialized: handler')
    return serializedData
  } catch (err) {
    log.error({ err }, 'fail: handler')
    throw err
  }
}
