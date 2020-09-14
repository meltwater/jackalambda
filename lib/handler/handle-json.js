import { createHandlerFactory } from './factory'
import { getUniversalCtx } from './get-context'

const identity = (data) => data

export const createJsonHandler = createHandlerFactory(
  identity,
  identity,
  getUniversalCtx
)
