import test, { beforeEach } from 'ava'

import { createProcessor } from '../../handlers/multi-status-json/processor'
import { createApiJsonHandler, parseJsonHttpEvent, readJson } from '../../lib'

beforeEach((t) => {
  t.context = {
    handler: createApiJsonHandler({
      parser: parseJsonHttpEvent,
      createProcessor,
      t
    })
  }
})

test('should not throw for empty body', async (t) => {
  const { handler } = t.context

  const event = await readJson('fixtures', 'http-event.json')

  await t.notThrowsAsync(async () => await handler(event, {}))
})

test('should return with statusCode and body', async (t) => {
  const { handler } = t.context

  const event = await readJson('fixtures', 'http-event.json')

  const result = await handler(event, {})

  t.log(result)
  t.is(result.statusCode, 200)
  t.true(typeof result.body === 'string')
  t.is(result.headers['Content-Type'], 'application/json')
  t.regex(result.headers['x-request-id'], /.{10,}/)
})

test('should return with 500 and error for body on failure', async (t) => {
  const { handler } = t.context

  const event = await readJson('fixtures', 'http-event-with-error.json')

  const result = await handler(event, {})

  t.log(result)
  t.is(result.statusCode, 500)
  t.regex(result.body.error.message, /demonstrate/)
  t.is(result.headers['Content-Type'], 'application/json')
  t.regex(result.headers['x-request-id'], /.{10,}/)
})

test('should return sent request id header', async (t) => {
  const { handler } = t.context

  const event = await readJson('fixtures', 'http-event.json')
  const reqId = event.headers['x-request-id']

  const result = await handler(event, {})

  t.is(result.headers['x-request-id'], reqId)
})

test('should return new request id if one was not provided', async (t) => {
  const { handler } = t.context

  const event = await readJson('fixtures', 'http-event.json')
  const reqId = event.headers['x-request-id']
  delete event.headers['x-request-id']

  const result = await handler(event, {})

  t.not(result.headers['x-request-id'], reqId)
  t.regex(result.headers['x-request-id'], /.{10,}/)
})

test('should return status code of error', async (t) => {
  const { handler } = t.context

  const event = await readJson('fixtures', 'http-event-with-error-with-status-code.json')

  const result = await handler(event, {})

  t.is(result.statusCode, 418)
})
