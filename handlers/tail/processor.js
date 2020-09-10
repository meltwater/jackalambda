import { createJsonHandler } from '../../lib'

import { Factories } from '../factories'

const createProcessor = (factories, { log }) => async (event, context) => {
  log.info('handled')
  return event
}

export const handle = createJsonHandler(
  [],
  (config, ctx) => new Factories(),
  createProcessor
)
