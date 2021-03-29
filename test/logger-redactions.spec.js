import test from 'ava'
import { createLogger } from '@meltwater/mlabs-logger'
import { LOGGER_REDACTION_LISTS } from '../lib/logger-redactions'

test('snapshot of redactions', async (t) => {
  t.snapshot(LOGGER_REDACTION_LISTS)
})

test('should not throw "pino – redact paths array contains an invalid path"', async (t) => {
  Object.values(LOGGER_REDACTION_LISTS).forEach((redact) =>
    createLogger({ redact })
  )
  t.pass()
})
