import { createJsonHandler } from '../../lib'

import { createFactories } from '../factories'

const createProcessor = (factories, { log }) => async (event, context) => {
  const tailLambdaClient = factories.getTailLambdaClient()
  log.info({ tailLambdaClient }, 'handled')
  return event
}

export const handle = createJsonHandler([], createFactories, createProcessor)
