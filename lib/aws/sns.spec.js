import test from 'ava'
import td from 'testdouble'
import createLogger from '@meltwater/mlabs-logger'

import { SnsClient } from './sns'

test.beforeEach((t) => {
  t.context.promise = td.function()
  t.context.snsClient = new SnsClient({ log: createLogger({ t }) })
  td.replace(t.context.snsClient, '_sns')
})

test('should pass topicArn to Sns as TopicArn', async (t) => {
  const topicArn = 'foo'
  const snsClient = new SnsClient({ topicArn, log: createLogger({ t }) })
  t.is(snsClient._sns.options.params.TopicArn, topicArn)
})

test.only('should return payload when invoke calledwith input and params', async (t) => {
  const { snsClient, promise } = t.context
  const input = { score: 10 }
  const params = { cheer: 'Huzzah!' }

  td.when(
    t.context.snsClient._sns.publish({
      Message: JSON.stringify(input),
      ...params,
      MessageAttributes: {
        reqId: {
          DataType: 'String',
          StringValue: snsClient._reqId
        }
      }
    })
  ).thenReturn({
    promise: t.context.promise
  })

  td.when(promise()).thenResolve({
    MessageId: 'msg-id',
    SequenceNumber: '123'
  })

  const data = await snsClient.publishJson(input, params)

  t.like(data, {
    messageId: 'msg-id',
    sequenceNumber: '123'
  })
})
