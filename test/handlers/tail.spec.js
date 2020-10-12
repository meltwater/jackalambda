import test from 'ava'

import { createJsonHandler } from '../../lib'
import { Container } from '../../handlers/container'
import { createProcessor } from '../../handlers/tail/processor'

test('processor', async (t) => {
  const event = { foo: 123 }

  const createContainer = (ctx) => {
    const container = new Container(mockConfig, ctx)
    return container
  }

  const handler = createJsonHandler({
    createContainer,
    createProcessor,
    t
  })

  const data = await handler(event, {})
  t.snapshot(data, 'handler')
})

const mockConfig = {}
