import test from 'ava'
import td from 'testdouble'
import createLogger from '@meltwater/mlabs-logger'

import { S3Client } from './s3'

test.beforeEach((t) => {
  t.context.promise = td.function()
  t.context.s3Client = (t) => {
    const s3Client = new S3Client({
      reqId: 'a-req-id',
      log: createLogger({ t })
    })

    td.replace(s3Client, '_s3')
    td.when(s3Client._s3.getObject(td.matchers.anything())).thenReturn({
      promise: t.context.promise
    })

    return s3Client
  }
})

test('should return payload', async (t) => {
  const { s3Client, promise } = t.context
  const payload = { success: true }

  td.when(promise()).thenReturn({
    Body: Buffer.from(JSON.stringify(payload), 'utf8')
  })

  const res = await s3Client(t).getObjectJson('payload.json')

  t.like(res, payload)
})

test('should return null is empty Body', async (t) => {
  const { s3Client, promise } = t.context

  td.when(promise()).thenReturn({
    Body: Buffer.from('', 'utf8')
  })

  const res = await s3Client(t).getObjectJson('payload.json')

  t.is(res, null)
})

test('should throw error if key is not non-white-space-string', async (t) => {
  const { s3Client } = t.context
  await t.throwsAsync(() => s3Client(t).getObjectJson(), {
    message: /Expected key to be a string/i
  })
})

test('should throw error if key is not json extension', async (t) => {
  const { s3Client } = t.context
  await t.throwsAsync(() => s3Client(t).getObjectJson('foo'), {
    message: /Reject non json Key/i
  })
})
