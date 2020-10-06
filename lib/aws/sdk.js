import AWS from 'aws-sdk'
import { captureAWS } from 'aws-xray-sdk'

// UPSTREAM: Needed to use serverless_offline plugin.
// https://github.com/dherault/serverless-offline/issues/327
const isXrayEnabled =
  !(process.env.IS_LOCAL || process.env.IS_OFFLINE) &&
  process.env.NODE_ENV === 'production'

/**
 * Get the AWS namespace wrapped in tracing where appropriate
 * @private
 * @returns {AWS} - The AWS namespace wrapped in tracing where appropriate
 */
export function getAws() {
  return isXrayEnabled ? captureAWS(AWS) : AWS
}
