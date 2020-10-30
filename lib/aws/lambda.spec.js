import test from 'ava'
import td from 'testdouble'
import createLogger from '@meltwater/mlabs-logger'

import { LambdaClient } from './lambda'

test.beforeEach((t) => {
  t.context.promise = td.function()
  t.context.createClient = (t) => {
    const client = new LambdaClient({
      reqId: 'a-req-id',
      log: createLogger({ t })
    })

    td.replace(client, '_lambda')

    return client
  }
})

test('should pass arn to AWS Lambda client as FunctionName', async (t) => {
  const arn = 'foo'
  const client = new LambdaClient({ arn, log: createLogger({ t }) })
  t.is(client._lambda.config.params.FunctionName, arn)
})

test('should return payload', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const promise = td.function()
  const payload = { success: true }

  td.when(client._lambda.invoke(td.matchers.anything())).thenReturn({ promise })

  td.when(promise()).thenResolve({
    Payload: JSON.stringify(payload),
    StatusCode: 200
  })

  const res = await client.invokeJson()

  t.like(res, payload)
})

test('should call invoke with stringify input and params', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const promise = td.function()
  const input = { score: 10, reqId: 'a-req-id' }
  const params = { cheer: 'Huzzah!' }

  td.when(promise()).thenResolve({
    StatusCode: 200,
    Payload: '{"foo":"bar"}'
  })

  td.when(
    client._lambda.invoke({ Payload: JSON.stringify(input), ...params })
  ).thenReturn({ promise })

  const res = await client.invokeJson(input, params)

  t.deepEqual(res, { foo: 'bar' })
})

test('should throw low status code error', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const promise = td.function()
  const lowStatusCode = 199

  td.when(client._lambda.invoke(td.matchers.anything())).thenReturn({ promise })

  td.when(promise()).thenResolve({ StatusCode: lowStatusCode })
  const error = await t.throwsAsync(() => client.invokeJson(), {
    message: /Status Code/i
  })
  t.like(error, { statusCode: lowStatusCode })
})

test('should throw high status code error', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const promise = td.function()
  const highStatusCode = 300

  td.when(client._lambda.invoke(td.matchers.anything())).thenReturn({ promise })

  td.when(promise()).thenResolve({ StatusCode: highStatusCode })
  const error = await t.throwsAsync(() => client.invokeJson(), {
    message: /Status Code/i
  })
  t.like(error, { statusCode: highStatusCode })
})

test('should throw function error', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const promise = td.function()

  td.when(client._lambda.invoke(td.matchers.anything())).thenReturn({ promise })

  td.when(promise()).thenResolve({
    StatusCode: 200,
    FunctionError: 'Unhandled',
    Payload: JSON.stringify(errorPayload)
  })
  const error = await t.throwsAsync(() => client.invokeJson(), {
    message: /Lambda function error/i
  })
  t.like(error, {
    code: 'lambda_function_error',
    data: errorPayload
  })
})

const errorPayload = {
  errorType: 'ReferenceError',
  errorMessage: 'x is not defined',
  trace: [
    'ReferenceError: x is not defined',
    '    at Runtime.exports.handler (/var/task/index.js:2:3)',
    '    at Runtime.handleOnce (/var/runtime/Runtime.js:63:25)',
    '    at process._tickCallback (internal/process/next_tick.js:68:7)'
  ]
}
