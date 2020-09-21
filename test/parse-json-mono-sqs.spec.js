import test from 'ava'

import { getJsonFixture } from '../fixtures'
import { parseJsonMonoSqsEvent } from '../lib/parser'

test('should parse well known sqs event', async (t) => {
  const sqsMessageEvent = await getJsonFixture('sqs-event.json')

  t.snapshot(parseJsonMonoSqsEvent(sqsMessageEvent), 'parsed sqs event')
})

test('should throw if more than one record is provided', async (t) => {
  const sqsMessageEvent = await getJsonFixture('sqs-event.json')
  sqsMessageEvent.Records.push({})

  t.throws(() => parseJsonMonoSqsEvent(sqsMessageEvent), {
    message: /more than one/i
  })
})

test('should return undefined for reqId if it is not present', async (t) => {
  const sqsMessageEvent = await getJsonFixture('sqs-event.json')
  sqsMessageEvent.Records[0].messageAttributes = {}

  const result = parseJsonMonoSqsEvent(sqsMessageEvent)

  t.is(result.reqId, undefined)
})
