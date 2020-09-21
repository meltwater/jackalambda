import test, { beforeEach } from 'ava'

import { getJsonFixture } from '../fixtures'
import { createContext } from '../lib/aws'

beforeEach((t) => {
  const lambdaContext = {
    awsRequestId: 'e609e19a-6303-4090-8404-ba28cd4f1468'
  }

  t.context = {
    lambdaContext
  }
})

test('should work for sqs event', async (t) => {
  const { lambdaContext } = t.context
  const sqsMessageEvent = await getJsonFixture('sqs-event.json')

  t.snapshot(createContext(sqsMessageEvent, lambdaContext), 'parsed sqs event')
})
