import { createApiJsonHandler, parseJsonHttpEvent } from '../../lib'
import { createProcessor } from './processor'

export const handlePost = createApiJsonHandler({
  parser: parseJsonHttpEvent,
  createProcessor
})
