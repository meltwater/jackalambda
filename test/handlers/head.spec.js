import test from 'ava'

import { createJsonHandler, readJson } from '../../lib'
import { Container } from '../../handlers/container'
import { createProcessor } from '../../handlers/head/processor'

const configurationRequests = []
const context = {
  functionName: 'head',
  awsRequestId: 'aws-req-id'
}

test('processor', async (t) => {
  const event = await readJson('fixtures', 'head.json')

  const createContainer = (ctx) => {
    const container = new Container(mockConfig, ctx)

    container.createTailLambdaClient = () => ({
      invokeJson: async (...args) => {
        t.snapshot(args, 'tailLambdaClient.invokeJson')
        return { foo: 123 }
      }
    })

    return container
  }

  const handler = createJsonHandler({
    configurationRequests,
    createContainer,
    createProcessor,
    t
  })

  const data = await handler(event, context)
  t.snapshot(data, 'handler')
})

const mockConfig = {}
