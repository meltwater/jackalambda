import test from 'ava'

import { createJsonHandler } from '../../lib'
import { Factories } from '../../handlers/factories'
import { createProcessor } from '../../handlers/tail/processor'

test('processor', async (t) => {
  const event = { foo: 123 }

  const createFactories = (ctx) => {
    const factories = new Factories(mockConfig, ctx)
    return factories
  }

  const handler = createJsonHandler({
    createFactories,
    createProcessor,
    t
  })

  const data = await handler(event, {})
  t.snapshot(data, 'handler')
})

const mockConfig = {}
