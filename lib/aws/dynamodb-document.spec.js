import test from 'ava'
import td from 'testdouble'
import createLogger from '@meltwater/mlabs-logger'

import { DynamodbDocumentClient } from './dynamodb-document'

test.beforeEach((t) => {
  t.context.client = (t, opts = {}) => {
    const client = new DynamodbDocumentClient({
      table: 'foo',
      hashKey: 'theHashKey',
      rangeKey: 'theRangeKey',
      reqId: 'a-req-id',
      log: createLogger({ t }),
      ...opts
    })

    td.replace(client, '_db')

    return client
  }
})

test('get should return item', async (t) => {
  const client = t.context.client(t)
  const key = { theHashKey: 'foo', theRangeKey: 'bar' }
  const promise = td.function()
  td.when(client._db.get({ Key: key })).thenReturn({ promise })
  td.when(promise()).thenResolve({ Item: { some: 'stuff' } })
  const res = await client.get(key)
  t.deepEqual(res, { some: 'stuff' })
})

test('get should validate hashKey', async (t) => {
  const client = t.context.client(t)
  const key = { notHashKey: 'foo', theRangeKey: 'bar' }
  await t.throwsAsync(() => client.get(key), { message: /hashKey/ })
})

test('get should validate rangeKey', async (t) => {
  const client = t.context.client(t)
  const key = { theHashKey: 'foo', notRangeKey: 'bar' }
  await t.throwsAsync(() => client.get(key), { message: /rangeKey/ })
})

test('get should not validate rangeKey if not set', async (t) => {
  const client = t.context.client(t, { rangeKey: undefined })
  const key = { theHashKey: 'foo', theRangeKey: 'bar' }
  const promise = td.function()
  td.when(client._db.get({ Key: key })).thenReturn({ promise })
  td.when(promise()).thenResolve({ Item: { some: 'stuff' } })
  const res = await client.get(key)
  t.deepEqual(res, { some: 'stuff' })
})

test('put should put item', async (t) => {
  const client = t.context.client(t)
  const item = { theHashKey: 'foo', theRangeKey: 'bar', more: 'stuff' }
  const promise = td.function()
  td.when(client._db.put({ Item: item })).thenReturn({ promise })
  td.when(promise()).thenResolve({ Attributes: { more: 'stuff' } })
  const res = await client.put(item)
  t.deepEqual(res, { more: 'stuff' })
})

test('put should validate hashKey', async (t) => {
  const client = t.context.client(t)
  const key = { notHashKey: 'foo', theRangeKey: 'bar' }
  await t.throwsAsync(() => client.put(key), { message: /hashKey/ })
})

test('put should validate rangeKey', async (t) => {
  const client = t.context.client(t)
  const key = { theHashKey: 'foo', notRangeKey: 'bar' }
  await t.throwsAsync(() => client.put(key), { message: /rangeKey/ })
})

test('put should not validate rangeKey if not set', async (t) => {
  const client = t.context.client(t, { rangeKey: undefined })
  const item = { theHashKey: 'foo', more: 'stuff' }
  const promise = td.function()
  td.when(client._db.put({ Item: item })).thenReturn({ promise })
  td.when(promise()).thenResolve({ Attributes: { more: 'stuff' } })
  const res = await client.put(item)
  t.deepEqual(res, { more: 'stuff' })
})
