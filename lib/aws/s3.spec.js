import test from 'ava'
import td from 'testdouble'
import createLogger from '@meltwater/mlabs-logger'

import { S3Client } from './s3'

test.beforeEach((t) => {
  t.context.createClient = (t) => {
    const client = new S3Client({
      reqId: 'a-req-id',
      log: createLogger({ t })
    })

    td.replace(client, '_s3')

    return client
  }
})

test('should return payload', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const promise = td.function()
  const payload = { success: true }

  td.when(client._s3.getObject({ Key: 'payload.json' })).thenReturn({
    promise
  })

  td.when(promise()).thenResolve({
    Body: Buffer.from(JSON.stringify(payload), 'utf8')
  })

  const res = await client.getObjectJson('payload.json')

  t.deepEqual(res, payload)
})

test('should throw error if empty key', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  await t.throwsAsync(() => client.getObjectJson(), {
    message: /key/i
  })
})

test('should throw if Body is not parsable', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const promise = td.function()

  td.when(client._s3.getObject(td.matchers.anything())).thenReturn({
    promise
  })

  td.when(promise()).thenResolve({
    Body: '{ 24 }'
  })

  await t.throwsAsync(() => client.getObjectJson('payload.json'), {
    message: /Body/i
  })
})
