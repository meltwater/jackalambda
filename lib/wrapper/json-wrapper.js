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
 * @param {parser=(event)=>event} parser - The parser provided through `createHandler`
 * @param {serializer=multiStatusCodeJsonSerializer} serializer - The serializer provided through `createHandler`
 * @returns {wrapper} - The wrapped processor
 */
export const createApiJsonWrapper = (
  ctx,
  parser = (event) => event,
  serializer = multiStatusCodeJsonSerializer
) => (processor) => async (event, context) => {
  const log = ctx.log.child({ meta: event, jackalambdaWrapper: 'api-json' })
  try {
    log.info('handle: start')
    const parsedEvent = parser(event, context)
    log.info({ meta: parsedEvent }, 'handle: parse')
    const data = await processor(parsedEvent, context)
    log.debug({ data }, 'handle: data')
    const serializedData = serializer(data, ctx)
    const { statusCode } = serializedData
    log.debug({ data: serializedData, statusCode }, 'handle: serialize')
    log.info({ statusCode }, 'handle: end')
    return serializedData
  } catch (err) {
    log.error({ err }, 'handle: fail')
    const serializedData = serializer(
      {
        statusCode: err.statusCode || 500,
        body: {
          error: {
            message: err.message || 'Internal Server Error'
          }
        }
      },
      ctx
    )
    const { statusCode } = serializedData
    log.debug({ data: serializedData, statusCode }, 'handle: data')
    log.info({ statusCode }, 'handle: end')
    return serializedData
  }
}
