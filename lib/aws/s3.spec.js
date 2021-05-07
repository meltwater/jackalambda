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

test('should pass bucket to AWS S3 client as Bucket', async (t) => {
  const bucket = 'foo'
  const client = new S3Client({ bucket, log: createLogger({ t }) })
  t.is(client._s3.config.params.Bucket, bucket)
})

test('upload and set metadata', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const body = 'binary'
  const key = 'object'

  td.when(
    client._s3.upload({
      Body: body,
      Metadata: {
        'x-request-id': 'a-req-id'
      },
      Key: key
    })
  ).thenReturn({
    promise: () => Promise.resolve({})
  })

  await client.upload(key, body)
  t.pass()
})

test('upload should throw error if empty key', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  await t.throwsAsync(() => client.upload(), {
    message: /key/i
  })
})

test('uploadJson upload and set metadata', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const body = { YAS: 'so good' }
  const key = 'payload.json'

  td.when(
    client._s3.upload({
      Body: JSON.stringify(body),
      ContentType: 'application/json',
      Metadata: {
        'x-request-id': 'a-req-id'
      },
      Key: key
    })
  ).thenReturn({
    promise: () => Promise.resolve({})
  })

  await client.uploadJson(key, body)
  t.pass()
})

test('uploadJson should throw error if empty key', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  await t.throwsAsync(() => client.uploadJson(), {
    message: /key/i
  })
})

test('getObject should return payload', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const promise = td.function()
  const payload = 'binary'

  td.when(client._s3.getObject({ Key: 'object' })).thenReturn({
    promise
  })

  const s3Resp = {
    Body: payload
  }
  td.when(promise()).thenResolve(s3Resp)

  const res = await client.getObject('object')

  t.deepEqual(res, s3Resp)
})

test('getObject should throw error if empty key', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  await t.throwsAsync(() => client.getObject(), {
    message: /key/i
  })
})

test('getObjectJson should return payload', async (t) => {
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

test('getObjectJson should throw error if empty key', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  await t.throwsAsync(() => client.getObjectJson(), {
    message: /key/i
  })
})

test('getObjectJson should throw if Body is not parsable', async (t) => {
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
