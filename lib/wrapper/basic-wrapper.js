/**
 * A wrapper that handles top level logging/parsing/serialization orchestration

 * @param {object} ctx - Internal use
 * @param {parser} parser - The parser provided through `createHandler`
 * @param {serializer} serializer - The serializer provided through `createHandler`
 * @returns {wrapper} - The wrapped processor
 */

export const createBasicWrapper = (ctx, parser, serializer) => (
  processor
) => async (event, context) => {
  const log = ctx.log.child({ meta: event, jackalambdaWrapper: 'default' })
  try {
    log.info({ meta: event }, 'start: createBasicWrapper')
    const parsedEvent = parser(event, context)
    const data = await processor(parsedEvent, context)
    log.debug({ data }, 'data: createBasicWrapper')
    const serializedData = serializer(data)
    log.info('end: createBasicWrapper')
    return serializedData
  } catch (err) {
    log.error({ err }, 'fail: createBasicWrapper')
    throw err
  }
}
