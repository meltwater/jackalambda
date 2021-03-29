import test from 'ava'
import { LOGGER_REDACTION_LISTS } from '../lib/logger-redactions'

test('snapshot of redactions', async (t) => {
  t.snapshot(LOGGER_REDACTION_LISTS)
})
