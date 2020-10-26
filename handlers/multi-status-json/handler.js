import { createApiJsonHandler, parseJsonHttpEvent } from '../../lib'
import { createContainer } from '../container'
import { createProcessor } from './processor'

export const handlePost = createApiJsonHandler({
  parser: parseJsonHttpEvent,
  createContainer,
  createProcessor
})
