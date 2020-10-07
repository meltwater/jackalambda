import test from 'ava'

import { createJsonHandler, readJson } from '../../lib'
import { Factories } from '../../handlers/factories'
import { createProcessor } from '../../handlers/head/processor'

const configurationRequests = []
const context = {
  functionName: 'head',
  awsRequestId: 'aws-req-id'
}

test('processor', async (t) => {
  const event = await readJson('fixtures', 'head.json')

  const createFactories = (ctx) => {
    const factories = new Factories(mockConfig, ctx)

    factories.createTailLambdaClient = () => ({
      invokeJson: async (...args) => {
        t.snapshot(args, 'tailLambdaClient.invokeJson')
        return { foo: 123 }
      }
    })

    return factories
  }

  const handler = createJsonHandler({
    configurationRequests,
    createFactories,
    createProcessor,
    t
  })

  const data = await handler(event, context)
  t.snapshot(data, 'handler')
})

const mockConfig = {}
