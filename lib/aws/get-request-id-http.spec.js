import test from 'ava'

import { getRequestIdHttp } from './get-request-id-http'

test('should return new id if there are no headers', (t) => {
  const event = {}

  const one = getRequestIdHttp(event)
  const two = getRequestIdHttp(event)

  t.true(typeof one === 'string')
  t.true(typeof two === 'string')
  t.true(one !== two)
})

test('should return new id if there is not a request id header', (t) => {
  const event = {
    headers: {}
  }

  const one = getRequestIdHttp(event)
  const two = getRequestIdHttp(event)

  t.true(typeof one === 'string')
  t.true(typeof two === 'string')
  t.true(one !== two)
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
