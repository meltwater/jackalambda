import test, { beforeEach } from 'ava'

import { SqsEvent } from './sqs-event'

beforeEach((t) => {
  t.context = {
    body: { hooray: 'for body!' }
  }
})

test('should throw if body is not an object', validateProperty, {
  propertyToBreak: 'body',
  badValue: 'strings are not valid'
})

test('should map parameters to properties', (t) => {
  const result = new SqsEvent(t.context)

  t.like(result, t.context)
})

test('body should be immutable', immutable, 'body')
test('httpMethod should be immutable', immutable, 'httpMethod')
test('pathParameters should be immutable', immutable, 'pathParameters')
test(
  'queryStringParameters should be immutable',
  immutable,
  'queryStringParameters'
)

function immutable(t, propertyName) {
  const result = new SqsEvent(t.context)

  t.throws(() => {
    result[propertyName] = 1234
  })
}

function validateProperty(t, { propertyToBreak, badValue }) {
  t.throws(
    () =>
      new SqsEvent({
        ...t.context,
        [propertyToBreak]: badValue
      }),
    {
      message: new RegExp(propertyToBreak)
    }
  )
}
