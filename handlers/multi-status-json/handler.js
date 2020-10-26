import { createJsonHandler } from '../../lib'
import { createContainer } from '../container'
import { createProcessor } from '../processor'

export const handlePost = createJsonHandler({
  createContainer,
  createProcessor
})
