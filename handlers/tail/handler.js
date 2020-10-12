import { createJsonHandler } from '../../lib'
import { createContainer } from '../container'
import { createProcessor } from '../processor'

export const handleInvoke = createJsonHandler({
  createContainer,
  createProcessor
})
