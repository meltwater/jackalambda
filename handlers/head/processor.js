import { createJsonHandler } from '../../lib'

import { createFactories } from '../factories'
import { configurationRequests } from './config'

const createProcessor = (factories, { log }) => async (event, context) => {
  const tailLambdaClient = factories.getTailLambdaClient()
  log.info({ tailLambdaClient }, 'handled')
  return event
}

export const handle = createJsonHandler(
  configurationRequests,
  createFactories,
  createProcessor
)
