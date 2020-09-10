import AWS from 'aws-sdk'
import { captureAWS } from 'aws-xray-sdk'

// UPSTREAM: Needed to use serverless_offline plugin.
// https://github.com/dherault/serverless-offline/issues/327
const isXrayEnabled = process.env._X_AMZN_TRACE_ID

export default isXrayEnabled ? captureAWS(AWS) : AWS
