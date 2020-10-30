import test from 'ava'
import td from 'testdouble'
import createLogger from '@meltwater/mlabs-logger'

import { LambdaClient } from './lambda'

test.beforeEach((t) => {
  t.context.promise = td.function()
  t.context.lambdaClient = (t) => {
    const lambdaClient = new LambdaClient({
      reqId: 'a-req-id',
      log: createLogger({ t })
    })

    td.replace(lambdaClient, '_lambda')
    td.when(lambdaClient._lambda.invoke(td.matchers.anything())).thenReturn({
      promise: t.context.promise
    })

    return lambdaClient
  }
})

test('should pass arn to AWS Lambda client as FunctionName', async (t) => {
  const arn = 'foo'
  const client = new LambdaClient({ arn, log: createLogger({ t }) })
  t.is(client._sqs.config.params.FunctionName, arn)
})

test('should return payload', async (t) => {
  const { lambdaClient, promise } = t.context
  const payload = { success: true }

  td.when(promise()).thenReturn({
    Payload: JSON.stringify(payload),
    StatusCode: 200
  })

  const res = await lambdaClient(t).invokeJson()

  t.like(res, payload)
})

test('should call invoke with stringify input and params', async (t) => {
  const { lambdaClient, promise } = t.context
  const input = { score: 10, reqId: 'a-req-id' }
  const params = { cheer: 'Huzzah!' }

  td.when(promise()).thenReturn({
    Payload: '{}',
    StatusCode: 200
  })

  const client = lambdaClient(t)

  td.when(
    client._lambda.invoke({ Payload: JSON.stringify(input), ...params })
  ).thenReturn({
    promise: () =>
      Promise.resolve({ StatusCode: 200, Payload: '{"foo":"bar"}' })
  })

  const res = await client.invokeJson(input, params)

  t.deepEqual(res, { foo: 'bar' })
})

test('should throw low status code error', async (t) => {
  const { lambdaClient, promise } = t.context
  const lowStatusCode = 199

  td.when(promise()).thenReturn({ StatusCode: lowStatusCode })
  const error = await t.throwsAsync(() => lambdaClient(t).invokeJson(), {
    message: /Status Code/i
  })
  t.like(error, { statusCode: lowStatusCode })
})

test('should throw high status code error', async (t) => {
  const { lambdaClient, promise } = t.context
  const highStatusCode = 300

  td.when(promise()).thenReturn({ StatusCode: highStatusCode })
  const error = await t.throwsAsync(() => lambdaClient(t).invokeJson(), {
    message: /Status Code/i
  })
  t.like(error, { statusCode: highStatusCode })
})

test('should throw function error', async (t) => {
  const { lambdaClient, promise } = t.context
  td.when(promise()).thenReturn({
    StatusCode: 200,
    FunctionError: 'Unhandled',
    Payload: JSON.stringify(errorPayload)
  })
  const error = await t.throwsAsync(() => lambdaClient(t).invokeJson(), {
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
