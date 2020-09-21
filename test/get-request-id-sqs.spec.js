import test, { beforeEach } from 'ava'

import { getJsonFixture } from '../fixtures'
import { getRequestIdSqs } from '../lib/ctx/get-request-id-sqs'

beforeEach(async (t) => {
  t.context = await getJsonFixture('sqs-event.json')
})

test('should get request Id', (t) => {
  t.snapshot(getRequestIdSqs(t.context), 'SQS Request ID')
})
