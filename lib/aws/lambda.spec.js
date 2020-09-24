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
