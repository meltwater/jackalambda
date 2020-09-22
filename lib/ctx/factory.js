import { annotateRequest } from '../aws'
import { createPreCtx } from './pre-ctx'
import { createLogger } from './logger'

export function createCtx(event, context) {
  const preCtx = createPreCtx(event, context)
  const log = createLogger(preCtx)
  annotateRequest(preCtx)

  return {
    ...preCtx,
    log
  }
}
