import test from 'ava'

import { createJsonHandler } from '../lib'
import { Factories } from '../handlers/factories'
import { createProcessor } from '../handlers/tail/processor'

test('processor', async (t) => {
  const event = { foo: 123 }

  const createFactories = (config, ctx) => {
    const factories = new Factories(config, ctx)
    return factories
  }

  const handler = createJsonHandler({
    configurationRequests: [],
    createFactories,
    createProcessor,
    t
  })

  const data = await handler(event, {})
  t.snapshot(data, 'handler')
})
