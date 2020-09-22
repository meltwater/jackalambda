import { createLogger } from '../logger'
import { annotateRequest } from '../aws'
import { createPreCtx } from './pre-ctx'

export function createCtx(event, context) {
  const preCtx = createPreCtx(event, context)
  const log = createLogger(preCtx)
  annotateRequest(preCtx)

  return {
    ...preCtx,
    log
  }
}
