import { getSegment } from 'aws-xray-sdk'

const isXrayEnabled = process.env._X_AMZN_TRACE_ID

export function annotateRequest ({ reqId }) {
  if (!isXrayEnabled) return
  const segment = getSegment()
  if (reqId) segment.addAnnotation('reqId', reqId)
}
