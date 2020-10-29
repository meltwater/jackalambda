/**
 * A wrapper that handles top level logging/parsing/serialization orchestration

 * @param {object} ctx - Internal use
 * @param {parser=(event)=>event} parser - The parser provided through `createHandler`
 * @param {serializer=(data)=>data} serializer - The serializer provided through `createHandler`
 * @returns {wrapper} - The wrapped processor
 */

export const createDefaultWrapper = (
  ctx,
  parser = (event) => event,
  serializer = (data) => data
) => (processor) => async (event, context) => {
  const log = ctx.log.child({ meta: event, jackalambdaWrapper: 'default' })
  try {
    log.info({ meta: event }, 'handler: start')
    const parsedEvent = parser(event, context)
    log.info({ meta: parsedEvent }, 'handler: parsed')
    const data = await processor(parsedEvent, context)
    log.debug({ data }, 'handler: unserialized')
    const serializedData = serializer(data, ctx)
    log.debug({ data: serializedData }, 'handler: serialized')
    return serializedData
  } catch (err) {
    log.error({ err }, 'handler: fail')
    throw err
  }
}
