import test, { beforeEach } from 'ava'

import { HttpEvent } from './http-event'

beforeEach((t) => {
  t.context = {
    body: {},
    httpMethod: 'GET',
    pathParameters: {},
    queryStringParameters: {},
    headers: {},
    requestContext: {},
    cookies: {}
  }
})

test('should throw if body is not an object', validateProperty, {
  propertyToBreak: 'body',
  badValue: 'strings are not valid'
})

test('should throw httpMethod is not a string', validateProperty, {
  propertyToBreak: 'httpMethod',
  badValue: 1234
})

test('should throw httpMethod is an empty string', validateProperty, {
  propertyToBreak: 'httpMethod',
  badValue: ''
})

test('should throw pathParameters is not an object', validateProperty, {
  propertyToBreak: 'pathParameters',
  badValue: 'not an object'
})

test('should throw pathParameters values are not strings', validateProperty, {
  propertyToBreak: 'pathParameters',
  badValue: { one: 1234 }
})

test('should throw queryStringParameters is not an object', validateProperty, {
  propertyToBreak: 'pathParameters',
  badValue: 'not an object'
})

test(
  'should throw queryStringParameters values are not arrays',
  validateProperty,
  {
    propertyToBreak: 'pathParameters',
    badValue: { one: 1234 }
  }
)

test(
  'should throw queryStringParameters values are not arrays or strings',
  validateProperty,
  {
    propertyToBreak: 'pathParameters',
    badValue: { one: [1234] }
  }
)

test('should throw headers is not an object', validateProperty, {
  propertyToBreak: 'headers',
  badValue: 'not an object'
})

test('should throw headers values are not arrays', validateProperty, {
  propertyToBreak: 'headers',
  badValue: { one: 1234 }
})

test(
  'should throw headers values are not arrays or strings',
  validateProperty,
  {
    propertyToBreak: 'headers',
    badValue: { one: [1234] }
  }
)

test('should throw requestContext is not object', validateProperty, {
  propertyToBreak: 'requestContext',
  badValue: '123'
})

test('should throw cookies is not object', validateProperty, {
  propertyToBreak: 'requestContext',
  badValue: '123'
})

test('should map parameters to properties', (t) => {
  const result = new HttpEvent(t.context)

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
test('headers should be immutable', immutable, 'headers')
test('requestContext should be immutable', immutable, 'requestContext')
test('cookies should be immutable', immutable, 'cookies')

function immutable(t, propertyName) {
  const result = new HttpEvent(t.context)

  t.throws(() => {
    result[propertyName] = 1234
  })
}

function validateProperty(t, { propertyToBreak, badValue }) {
  t.throws(
    () =>
      new HttpEvent({
        ...t.context,
        [propertyToBreak]: badValue
      }),
    {
      message: new RegExp(propertyToBreak)
    }
  )
}
