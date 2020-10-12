import { createJsonHandler } from '../../lib'
import { createContainer } from '../container'
import { configurationRequests } from './config'
import { createProcessor } from './processor'

export const handleInvoke = createJsonHandler({
  configurationRequests,
  createContainer,
  createProcessor
})
