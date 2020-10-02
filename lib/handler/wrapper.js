/**
 * @private
 */
export const createWrapper = (parser, serializer, ctx) => (processor) => async (
  event,
  context
) => {
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
