import test from 'ava'

import { getJsonFixture } from '../fixtures'
import { parseHttpEvent } from '../lib/aws'

test('should successfully parse POST http event', async (t) => {
  const event = await getJsonFixture('http-event.json')

  const result = parseHttpEvent(event)

  t.snapshot(result, 'POST Event')
})

test('should successfully parse when there are no path parameters', async (t) => {
  const event = await getJsonFixture('http-event.json')

  const updatedEvent = {
    ...event,
    pathParameters: null
  }

  const result = parseHttpEvent(updatedEvent)

  t.snapshot(result, 'No path parameters Event')
})

test('should successfully parse when there are no query string parameters', async (t) => {
  const event = await getJsonFixture('http-event.json')

  const updatedEvent = {
    ...event,
    multiValueQueryStringParameters: null
  }

  const result = parseHttpEvent(updatedEvent)

  t.snapshot(result, 'No query string parameters Event')
})

test('should successfully parse when there is no request in the headers', async (t) => {
  const event = await getJsonFixture('http-event.json')

  const updatedEvent = {
    ...event,
    headers: {
      ...event.headers,
      'x-request-id': undefined
    }
  }

  const result = parseHttpEvent(updatedEvent)

  const { reqId, ...noReqIdResult } = result

  t.snapshot(noReqIdResult, 'No request Event')
  t.is(typeof reqId, 'string')
})

test('should successfully parse PUT http event', async (t) => {
  const event = await getJsonFixture('http-event.json')

  const putEvent = {
    ...event,
    httpMethod: 'PUT'
  }

  const result = parseHttpEvent(putEvent)

  t.snapshot(result, 'PUT Event')
})

test('should successfully parse PATCH http event', async (t) => {
  const event = await getJsonFixture('http-event.json')

  const patchEvent = {
    ...event,
    httpMethod: 'PATCH'
  }

  const result = parseHttpEvent(patchEvent)

  t.snapshot(result, 'PATCH Event')
})

test('should provide empty object body if method is GET', async (t) => {
  const event = await getJsonFixture('http-event.json')

  const getEvent = {
    ...event,
    httpMethod: 'GET'
  }

  const result = parseHttpEvent(getEvent)

  t.snapshot(result, 'GET Event with empty object body')
})
