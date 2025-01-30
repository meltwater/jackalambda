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
  const log = ctx.log.child({ jackalambdaWrapper: 'default' })
  try {
    log.info('handle: start')
    const parsedEvent = parser(event, context)
    log.info('handle: parse')
    const data = await processor(parsedEvent, context)
    log.debug('handle: data')
    const serializedData = serializer(data, ctx)
    log.debug('handle: serialize')
    log.info('handle: end')
    return serializedData
  } catch (err) {
    log.error({ err }, 'handle: fail')
    throw err
  }
}
