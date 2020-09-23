import test, { beforeEach } from 'ava'

import { getJsonFixture } from '../fixtures'
import { createPreCtx } from '../lib/ctx/pre-ctx'

beforeEach((t) => {
  t.context = {
    functionName: 'my-func',
    awsRequestId: 'e609e19a-6303-4090-8404-ba28cd4f1468'
  }
})

test('should work for sqs event', async (t) => {
  const sqsMessageEvent = await getJsonFixture('sqs-event.json')
  t.snapshot(createPreCtx(sqsMessageEvent, t.context), 'parsed sqs event')
})
