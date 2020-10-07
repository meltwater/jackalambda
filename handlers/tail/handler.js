import { createJsonHandler } from '../../lib'
import { createFactories } from '../factories'
import { createProcessor } from '../processor'

export const handleInvoke = createJsonHandler({
  createFactories,
  createProcessor
})
