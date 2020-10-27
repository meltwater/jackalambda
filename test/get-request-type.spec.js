import test from 'ava'

import { getJsonFixture } from '../fixtures'
import { getEventType } from '../lib/ctx/get-event-type'
import { EventType } from '../lib/ctx/event-type'

test('should return apiGatewayAwsProxy event type for proxy http event', async (t) => {
  const event = await getJsonFixture('http-event.json')
  t.log(event)
  const result = getEventType(event)

  t.is(result, EventType.apiGatewayAwsProxy)
})

test('should return apiGatewayLambdaIntegration event type for non proxy http event', async (t) => {
  const event = await getJsonFixture('non-proxy-http-event.json')
  t.log(event)
  const result = getEventType(event)

  t.is(result, EventType.apiGatewayLambdaIntegration)
})

test('should return sqs event type for sqs event', async (t) => {
  const event = await getJsonFixture('sqs-event.json')
  t.log(event)
  const result = getEventType(event)

  t.is(result, EventType.sqs)
})
