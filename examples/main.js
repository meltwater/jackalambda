import path from 'path'

import createExamples from '@meltwater/examplr'

import head from './head'

const examples = {
  head
}

const envVars = ['LOG_LEVEL', 'LOG_FILTER', 'LOG_OUTPUT_MODE']

const defaultOptions = {}

const { runExample } = createExamples({
  examples,
  envVars,
  defaultOptions
})

runExample({
  local: path.resolve('examples', 'local.json')
})
