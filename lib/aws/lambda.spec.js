import test from 'ava'
import td from 'testdouble'

import { LambdaClient } from './lambda'

test.beforeEach((t) => {
  t.context.promise = td.function()
  t.context.lambdaClient = new LambdaClient({})
  td.replace(t.context.lambdaClient, '_lambda')
  td.when(t.context.lambdaClient._lambda.invoke(td.matchers.anything())).thenReturn({
    promise: t.context.promise
  })
})

test('should return payload', async (t) => {
  const { lambdaClient, promise } = t.context
  const payload = { success: true }

  td.when(promise()).thenReturn({
    Payload: JSON.stringify(payload),
    StatusCode: 200
  })

  const res = await lambdaClient.invokeJson()

  t.like(res, payload)
})

test('should call invoke with stringify input and params', async (t) => {
  const { lambdaClient, promise } = t.context
  const input = { score: 10 }
  const params = { cheer: 'Huzzah!' }

  td.when(promise()).thenReturn({
    Payload: '{}',
    StatusCode: 200
  })

  await lambdaClient.invokeJson(input, params)
  td.verify(
    lambdaClient._lambda.invoke({ Payload: JSON.stringify(input), ...params })
  )
  t.pass()
})

test('should throw status code error', async (t) => {
  const { lambdaClient, promise } = t.context
  const lowStatusCode = 199
  const highStatusCode = 300
  let error

  td.when(promise()).thenReturn({ StatusCode: lowStatusCode })
  error = await t.throwsAsync(() => lambdaClient.invokeJson())
  t.like(error, { statusCode: lowStatusCode })
  t.regex(error.message, /Status Code/i)

  td.when(promise()).thenReturn({ StatusCode: highStatusCode })
  error = await t.throwsAsync(() => lambdaClient.invokeJson())
  t.like(error, { statusCode: highStatusCode })
  t.regex(error.message, /Status Code/i)
})
