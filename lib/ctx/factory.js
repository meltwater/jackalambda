import { createLogger, logFatal } from '../logger'
import { annotateRequest } from '../aws'
import { createPreCtx } from './pre-ctx'

export function createCtx(event, context) {
  try {
    const preCtx = createPreCtx(event, context)
    const log = createLogger(preCtx)
    annotateRequest(preCtx)

    return {
      ...preCtx,
      log
    }
  } catch (err) {
    logFatal(err, 'create ctx')
    throw err
  }
}
