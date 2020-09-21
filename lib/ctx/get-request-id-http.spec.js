import test from 'ava'

import { getRequestIdHttp } from './get-request-id-http'

test('should return no id if there are no headers', (t) => {
  const event = {}
  const reqId = getRequestIdHttp(event)
  t.is(reqId, undefined)
})

test('should return id', (t) => {
  const requestId = 'hooray!'
  const event = {
    headers: {
      'x-request-id': requestId
    }
  }

  t.is(getRequestIdHttp(event), requestId)
})

test('should return id for oddly capitalized header', (t) => {
  const requestId = 'hooray!'
  const event = {
    headers: {
      'X-rEqUeSt-Id': requestId
    }
  }

  t.is(getRequestIdHttp(event), requestId)
})
