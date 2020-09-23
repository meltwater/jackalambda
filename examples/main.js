import path from 'path'

import createExamples from '@meltwater/examplr'

import head from './head'

const examples = {
  head
}

const envVars = ['LOG_LEVEL', 'LOG_FILTER', 'LOG_OUTPUT_MODE']

const defaultOptions = {
  headLambdaArn:
    'arn:aws:lambda:eu-west-1:768139847509:function:jackalambda-staging-head'
}

const { runExample } = createExamples({
  examples,
  envVars,
  defaultOptions
})

runExample({
  local: path.resolve('examples', 'local.json')
})
