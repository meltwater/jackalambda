import test from 'ava'
import td from 'testdouble'
import createLogger from '@meltwater/mlabs-logger'

import { SqsClient } from './sqs'

test.beforeEach((t) => {
  t.context.promise = td.function()
  t.context.sqsClient = new SqsClient({ log: createLogger({ t }) })
  td.replace(t.context.sqsClient, '_sqs')
})

test('should pass queueUrl to Sqs as FunctionName', async (t) => {
  const queueUrl = 'foo'
  const sqsClient = new SqsClient({ queueUrl, log: createLogger({ t }) })
  t.is(sqsClient._sqs.config.params.QueueUrl, queueUrl)
})

test('should pass params to Sqs not using arn', async (t) => {
  const queueUrl = 'is not used'
  const params = { foo: 'bar', QueueUrl: 'baz' }
  const sqsClient = new SqsClient({ queueUrl, params, log: createLogger({ t }) })
  t.like(sqsClient._sqs.config.params, params)
})

test.only('should return payload when invoke calledwith input and params', async (t) => {
  const { sqsClient, promise } = t.context
  const payload = { success: true }
  const input = { score: 10 }
  const params = { cheer: 'Huzzah!' }

  td.when(
    t.context.sqsClient._sqs.sendMessage({
      MessageBody: JSON.stringify(input),
      ...params,
      MessageAttributes: {
        reqId: {
          DataType: 'String',
          StringValue: sqsClient._reqId
        }
      }
    })
  ).thenReturn({
    promise: t.context.promise
  })

  td.when(promise()).thenReturn({
    MD5OfMessageBody: payload
  })

  const { body } = await sqsClient.publishJson(input, params)

  t.like(body, payload)
})
