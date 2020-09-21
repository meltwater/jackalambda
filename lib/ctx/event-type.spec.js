import test from 'ava'

import { EventType } from './event-type'

test('isValid should return false for invalid eventType', (t) => {
  t.false(EventType.isValid('not a real event type'))
})

test('isValid should return true for valid eventType', (t) => {
  t.true(EventType.isValid(EventType.apiGatewayAuthorizer))
})
