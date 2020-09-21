import test, { beforeEach } from 'ava'

import { SingleRecordSqsEvent } from './single-record-sqs-event'

beforeEach((t) => {
  t.context = {
    body: { something: 'truly amazing' }
  }
})

test('should throw if body is not an object', (t) => {
  t.throws(
    () => new SingleRecordSqsEvent({ body: 'definitely not an object' }),
    { message: /body/i }
  )
})

test('should map properties', (t) => {
  const result = new SingleRecordSqsEvent(t.context)

  t.like(result, t.context)
})

test('should be immutable', (t) => {
  const result = new SingleRecordSqsEvent(t.context)

  t.throws(() => {
    result.body = 1234
  })
})
