import test from 'ava'
import td from 'testdouble'
import createLogger from '@meltwater/mlabs-logger'

import { DynamodbDocumentClient } from './dynamodb-document'

test.beforeEach((t) => {
  const hashKey = 'theHashKey'
  const rangeKey = 'theRangeKey'
  const createClient = (t, opts = {}) => {
    const client = new DynamodbDocumentClient({
      table: 'foo',
      hashKey,
      rangeKey,
      reqId: 'a-req-id',
      log: createLogger({ t }),
      ...opts
    })

    td.replace(client, '_db')

    return client
  }

  t.context = {
    createClient,
    hashKey,
    rangeKey
  }
})

test('should pass table to AWS DynamoDB DocumentClient client as TableName', async (t) => {
  const table = 'foo'
  const client = new DynamodbDocumentClient({
    table,
    hashKey: 'foo',
    log: createLogger({ t })
  })
  t.is(client._db.options.params.TableName, table)
})

test('should validate arguments', (t) => {
  const opts = {
    table: 'foo',
    hashKey: 'theHashKey',
    rangeKey: 'theRangeKey',
    reqId: 'a-req-id',
    log: createLogger({ t })
  }
  t.throws(
    () =>
      new DynamodbDocumentClient(
        { ...opts, hashKey: undefined },
        { message: /hashKey/ }
      )
  )
  t.throws(
    () =>
      new DynamodbDocumentClient(
        { ...opts, rangeKey: 0 },
        { message: /rangeKey/ }
      )
  )
  t.truthy(new DynamodbDocumentClient({ ...opts, rangeKey: undefined }))
})

test('get should return item', async (t) => {
  const { createClient, hashKey, rangeKey } = t.context
  const client = createClient(t)
  const key = { [hashKey]: 'foo', [rangeKey]: 'bar' }
  const promise = td.function()
  td.when(
    client._db.get({
      Key: key
    })
  ).thenReturn({ promise })
  td.when(promise()).thenResolve({ Item: { some: 'stuff' } })

  const res = await client.get(key)

  t.deepEqual(res, { some: 'stuff' })
})

test('get should validate hashKey', async (t) => {
  const { createClient, rangeKey } = t.context
  const client = createClient(t)
  const key = { notHashKey: 'foo', [rangeKey]: 'bar' }

  await t.throwsAsync(() => client.get(key), { message: /hashKey/ })
})

test('get should validate rangeKey', async (t) => {
  const { createClient, hashKey } = t.context
  const client = createClient(t)
  const key = { [hashKey]: 'foo', notRangeKey: 'bar' }

  await t.throwsAsync(() => client.get(key), { message: /rangeKey/ })
})

test('get should not validate rangeKey if not set', async (t) => {
  const { createClient, hashKey, rangeKey } = t.context
  const client = createClient(t, { rangeKey: undefined })
  const key = { [hashKey]: 'foo', [rangeKey]: 'bar' }
  const promise = td.function()
  td.when(
    client._db.get({
      Key: key
    })
  ).thenReturn({ promise })
  td.when(promise()).thenResolve({ Item: { some: 'stuff' } })

  const res = await client.get(key)

  t.deepEqual(res, { some: 'stuff' })
})

test('put should put item', async (t) => {
  const { createClient, hashKey, rangeKey } = t.context
  const client = createClient(t)
  const item = { [hashKey]: 'foo', [rangeKey]: 'bar', more: 'stuff' }
  const promise = td.function()
  td.when(
    client._db.put({
      Item: item
    })
  ).thenReturn({ promise })
  td.when(promise()).thenResolve({ Attributes: { more: 'stuff' } })

  const res = await client.put(item)

  t.deepEqual(res, { more: 'stuff' })
})

test('put should validate hashKey', async (t) => {
  const { createClient, rangeKey } = t.context
  const client = createClient(t)
  const key = { notHashKey: 'foo', [rangeKey]: 'bar' }

  await t.throwsAsync(() => client.put(key), { message: /hashKey/ })
})

test('put should validate rangeKey', async (t) => {
  const { createClient, hashKey } = t.context
  const client = createClient(t)
  const key = { [hashKey]: 'foo', notRangeKey: 'bar' }

  await t.throwsAsync(() => client.put(key), { message: /rangeKey/ })
})

test('put should not validate rangeKey if not set', async (t) => {
  const { createClient, hashKey } = t.context
  const client = createClient(t, { rangeKey: undefined })
  const item = { [hashKey]: 'foo', more: 'stuff' }
  const promise = td.function()
  td.when(
    client._db.put({
      Item: item
    })
  ).thenReturn({ promise })
  td.when(promise()).thenResolve({ Attributes: { more: 'stuff' } })

  const res = await client.put(item)

  t.deepEqual(res, { more: 'stuff' })
})

test('query should return items', async (t) => {
  const { createClient, hashKey } = t.context
  const client = createClient(t)
  const promise = td.function()
  const params = {
    KeyExpression: {
      [hashKey]: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ['foo']
      }
    }
  }
  td.when(client._db.query(params)).thenReturn({ promise })
  const Items = [{ some: 'stuff' }]
  td.when(promise()).thenResolve({ Items })

  const { items } = await client.query(params)

  t.deepEqual(items, items)
})

test('update should return item', async (t) => {
  const { createClient, hashKey, rangeKey } = t.context
  const client = createClient(t)
  const key = { [hashKey]: 'foo', [rangeKey]: 'bar' }
  const promise = td.function()
  td.when(
    client._db.update({
      Key: key
    })
  ).thenReturn({ promise })
  td.when(promise()).thenResolve({ some: 'stuff' })

  const res = await client.update(key)

  t.deepEqual(res, { some: 'stuff' })
})

test('update should validate hashKey', async (t) => {
  const { createClient, rangeKey } = t.context
  const client = createClient(t)
  const key = { notHashKey: 'foo', [rangeKey]: 'bar' }

  await t.throwsAsync(() => client.update(key), { message: /hashKey/ })
})

test('update should validate rangeKey', async (t) => {
  const { createClient, hashKey } = t.context
  const client = createClient(t)
  const key = { [hashKey]: 'foo', notRangeKey: 'bar' }

  await t.throwsAsync(() => client.update(key), { message: /rangeKey/ })
})

test('update should not validate rangeKey if not set', async (t) => {
  const { createClient, hashKey, rangeKey } = t.context
  const client = createClient(t, { rangeKey: undefined })
  const key = { [hashKey]: 'foo', [rangeKey]: 'bar' }
  const promise = td.function()
  td.when(
    client._db.update({
      Key: key
    })
  ).thenReturn({ promise })
  td.when(promise()).thenResolve({ some: 'stuff' })

  const res = await client.update(key)

  t.deepEqual(res, { some: 'stuff' })
})

test('delete should not throw error', async (t) => {
  const { createClient, hashKey, rangeKey } = t.context
  const client = createClient(t)
  const key = { [hashKey]: 'foo', [rangeKey]: 'bar' }
  const promise = td.function()
  td.when(
    client._db.delete({
      Key: key
    })
  ).thenReturn({ promise })
  td.when(promise()).thenResolve()

  await client.delete(key)

  t.pass()
})

test('delete should validate hashKey', async (t) => {
  const { createClient, rangeKey } = t.context
  const client = createClient(t)
  const key = { notHashKey: 'foo', [rangeKey]: 'bar' }

  await t.throwsAsync(() => client.delete(key), { message: /hashKey/ })
})

test('delete should validate rangeKey', async (t) => {
  const { createClient, hashKey } = t.context
  const client = createClient(t)
  const key = { [hashKey]: 'foo', notRangeKey: 'bar' }

  await t.throwsAsync(() => client.delete(key), { message: /rangeKey/ })
})

test('delete should not validate rangeKey if not set', async (t) => {
  const { createClient, hashKey, rangeKey } = t.context
  const client = createClient(t, { rangeKey: undefined })
  const key = { [hashKey]: 'foo', [rangeKey]: 'bar' }
  const promise = td.function()
  td.when(
    client._db.delete({
      Key: key
    })
  ).thenReturn({ promise })
  td.when(promise()).thenResolve({ some: 'stuff' })

  await client.delete(key)

  t.pass()
})
