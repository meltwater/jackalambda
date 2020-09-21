import test from 'ava'

import { getRequestIdSqs } from './get-request-id-sqs'

test('should return no request id if event is missing Records', (t) => {
  const event = {}
  const reqId = getRequestIdSqs(event)
  t.is(reqId, undefined)
})

test('should return no request id if event is missing messageAttributes', (t) => {
  const event = {
    Records: [{}]
  }
  const reqId = getRequestIdSqs(event)
  t.is(reqId, undefined)
})

test('should return no request id if event is missing reqId', (t) => {
  const event = {
    Records: [
      {
        messageAttributes: {}
      }
    ]
  }
  const reqId = getRequestIdSqs(event)
  t.is(reqId, undefined)
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
