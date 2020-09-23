import { createJsonHandler } from '../../lib'
import { createFactories } from '../factories'
import { configurationRequests } from './config'
import { createProcessor } from './processor'

export const handleInvoke = createJsonHandler({
  configurationRequests,
  createFactories,
  createProcessor
})
