import test from 'ava'

import { getJsonFixture } from '../fixtures'
import { parseMonoSqsEvent } from '../lib/aws'

test('should parse well known sqs event', async (t) => {
  const sqsMessageEvent = await getJsonFixture('sqs-event.json')

  t.snapshot(parseMonoSqsEvent(sqsMessageEvent), 'parsed sqs event')
})

test('should throw if more than one record is provided', async (t) => {
  const sqsMessageEvent = await getJsonFixture('sqs-event.json')
  sqsMessageEvent.Records.push({})

  t.throws(() => parseMonoSqsEvent(sqsMessageEvent), {
    message: /more than one/i
  })
})

test('should return undefined for reqId if it is not present', async (t) => {
  const sqsMessageEvent = await getJsonFixture('sqs-event.json')
  sqsMessageEvent.Records[0].messageAttributes = {}

  const result = parseMonoSqsEvent(sqsMessageEvent)

  t.is(result.reqId, undefined)
})
