import test from 'ava'

import { getJsonFixture } from '../fixtures'
import { parseHttpEvent } from '../lib/aws'

test('should successfully parse POST http event', async (t) => {
  const event = await getJsonFixture('http-event.json')

  const result = parseHttpEvent(event)

  t.snapshot(result, 'POST Event')
  t.is(typeof result.body, 'object')
})

test('should successfully parse PUT http event', async (t) => {
  const event = await getJsonFixture('http-event.json')

  const putEvent = {
    ...event,
    httpMethod: 'PUT'
  }

  const result = parseHttpEvent(putEvent)

  t.snapshot(result, 'PUT Event')
  t.is(typeof result.body, 'object')
})

test('should successfully parse PATCH http event', async (t) => {
  const event = await getJsonFixture('http-event.json')

  const patchEvent = {
    ...event,
    httpMethod: 'PATCH'
  }

  const result = parseHttpEvent(patchEvent)

  t.snapshot(result, 'PATCH Event')
  t.is(typeof result.body, 'object')
})

test('should not provide body if method is GET', async (t) => {
  const event = await getJsonFixture('http-event.json')

  const getEvent = {
    ...event,
    httpMethod: 'GET'
  }

  const result = parseHttpEvent(getEvent)

  t.snapshot(result, 'GET Event')
  t.is(Object.keys(result.body).length, 0, 'Body should be an empty object')
})
