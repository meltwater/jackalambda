'use strict'

const AWS = require('aws-sdk')
const { captureAWS } = require('aws-xray-sdk')

// UPSTREAM: Needed to use serverless_offline plugin.
// https://github.com/dherault/serverless-offline/issues/327
const isXrayEnabled =
  !(process.env.IS_LOCAL || process.env.IS_OFFLINE) &&
  process.env.NODE_ENV === 'production'

module.exports = isXrayEnabled ? captureAWS(AWS) : AWS
