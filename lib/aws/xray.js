import { getSegment } from 'aws-xray-sdk'

// UPSTREAM: Needed to use serverless_offline plugin.
// https://github.com/dherault/serverless-offline/issues/327
const isXrayEnabled =
  !(process.env.IS_LOCAL || process.env.IS_OFFLINE) &&
  process.env.NODE_ENV === 'production'

/** If possible, add the distributed tracing reqId to xray trace */
export function annotateRequest({ reqId }) {
  if (!isXrayEnabled) return
  const segment = getSegment()
  if (reqId) segment.addAnnotation('reqId', reqId)
}
