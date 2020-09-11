import { createJsonHandler } from '../../lib'

import { createFactories } from '../factories'
import { configurationRequests } from './config'

const createProcessor = (factories, { log }) => async (event, context) => {
  const tailLambdaClient = factories.getTailLambdaClient()
  return tailLambdaClient.invokeJson(event)
}

export const handleInvoke = createJsonHandler({
  configurationRequests,
  createFactories,
  createProcessor
})
