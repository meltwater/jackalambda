'use strict'

const AWS = require('aws-sdk')
const { captureAWS } = require('aws-xray-sdk')

// UPSTREAM: Needed to use serverless_offline plugin.
// https://github.com/dherault/serverless-offline/issues/327
const isXrayEnabled = process.env._X_AMZN_TRACE_ID

module.exports = isXrayEnabled ? captureAWS(AWS) : AWS
