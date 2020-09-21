import test from 'ava'

import { getRequestIdSqs } from './get-request-id-sqs'

test('should return new request id if event is missing Records', (t) => {
  const one = getRequestIdSqs({})
  const two = getRequestIdSqs({})

  t.true(typeof one === 'string')
  t.true(typeof two === 'string')
  t.true(one !== two)
})

test('should return new request id if event is missing messageAttributes', (t) => {
  const event = {
    Records: [{}]
  }
  const one = getRequestIdSqs(event)
  const two = getRequestIdSqs(event)

  t.true(typeof one === 'string')
  t.true(typeof two === 'string')
  t.true(one !== two)
})

test('should return new request id if event is missing reqId', (t) => {
  const event = {
    Records: [
      {
        messageAttributes: {}
      }
    ]
  }
  const one = getRequestIdSqs(event)
  const two = getRequestIdSqs(event)

  t.true(typeof one === 'string')
  t.true(typeof two === 'string')
  t.true(one !== two)
})

test('should return request id', (t) => {
  const requestId = 'Yaaaaaaaaaaaaas'
  const event = {
    Records: [
      {
        messageAttributes: {
          reqId: {
            StringValue: requestId
          }
        }
      }
    ]
  }

  t.is(getRequestIdSqs(event), requestId)
})
