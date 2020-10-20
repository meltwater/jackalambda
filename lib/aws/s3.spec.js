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

test('should throw error if empty key', async (t) => {
  const { s3Client } = t.context
  await t.throwsAsync(() => s3Client(t).getObjectJson(), {
    message: /key/i
  })
})

test('should throw if empty Body', async (t) => {
  const { s3Client, promise } = t.context

  td.when(promise()).thenReturn({
    Body: Buffer.from('', 'utf8')
  })

  await t.throwsAsync(() => s3Client(t).getObjectJson('payload.json'), {
    message: /bodyString/i
  })
})
