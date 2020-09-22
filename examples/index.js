process.env.AWS_SDK_LOAD_CONFIG = 'true'
process.env.IS_LOCAL = 'true'

process.env.SSM_TAIL_LAMBDA_ARN =
  '/meltwater/jackalope/staging/jackalambda/tail_lambda_arn'

/* eslint-disable no-global-assign */
require = require('esm')(module, { mode: 'auto' })
module.exports = require('./main')
