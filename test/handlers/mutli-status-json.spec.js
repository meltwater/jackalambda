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
})

test('should return with 500 and error for body on failure', async (t) => {
  const { handler } = t.context

  const event = await readJson('fixtures', 'http-event-with-error.json')

  const result = await handler(event, {})

  t.log(result)
  t.is(result.statusCode, 500)
  t.regex(result.body, /demonstrate/)
  t.is(result.headers['Content-Type'], 'application/json')
})
