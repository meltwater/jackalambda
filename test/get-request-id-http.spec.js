import test, { beforeEach } from 'ava'

import { getJsonFixture } from '../fixtures'
import { getRequestIdHttp } from '../lib/ctx/get-request-id-http'

beforeEach(async (t) => {
  t.context = await getJsonFixture('http-event.json')
})

test('should get request Id', (t) => {
  t.snapshot(getRequestIdHttp(t.context), 'HTTP Request ID')
})
