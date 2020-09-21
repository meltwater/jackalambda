import { createContext } from './create-context'
import { createLogger } from './logger'

export function createCtx(event, context) {
  const preCtx = createContext(event, context)
  const log = createLogger(preCtx)

  return {
    ...preCtx,
    log
  }
}
