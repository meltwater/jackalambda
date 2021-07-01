import ac from 'argument-contracts'
import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

import { getAws } from './sdk'

/**
 * A wrapper around AWS.DynamoDB.DocumentClient to simplify interactions
 * @param {Object} options - See below
 * @param {string} options.table - The DynamoDB table name
 * @param {string} options.hashKey - The DynamoDB table hash key.
 * @param {string} options.rangeKey - The DynamoDB table range key (if set).
 * @param {string} options.name - The name to be used for the 'client' property on the logger
 * @param {string} options.reqId - The reqId used for distributed log tracing
 * @param {Object} options.log - A pino compatible logger
 * @param {Object} options.params - Additional parameters to the AWS.S3 constructor 'params' property
 */
export class DynamodbDocumentClient {
  constructor({
    table,
    name = 'dynamodb-document',
    hashKey,
    rangeKey,
    reqId = uuidv4(),
    log = createLogger(),
    params = {}
  }) {
    ac.assertNonWhiteSpaceString(table, 'table')
    ac.assertNonWhiteSpaceString(hashKey, 'hashKey')
    if (!(rangeKey == null)) ac.assertNonWhiteSpaceString(rangeKey, 'rangeKey')

    const defaultParams = { TableName: table, ...params }
    const AWS = getAws()
    this._table = table
    this._hashKey = hashKey
    this._rangeKey = rangeKey
    this._db = new AWS.DynamoDB.DocumentClient({ params: defaultParams })
    this._reqId = reqId
    this._log = log.child({
      defaultParams,
      client: name,
      class: 'DynamodbDocumentClient',
      reqId
    })
  }

  async get(key, params = {}) {
    const log = this._log.child({
      ...this._getHashAndRangeKeyObj(key),
      meta: { key, params },
      method: 'get'
    })
    try {
      log.info('start')
      this._validateHashAndRangeKey(key)

      const req = {
        Key: key,
        ...params
      }

      const res = await this._db.get(req).promise()
      const data = res.Item
      log.debug({ data }, 'data')
      log.info('end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }

  async put(item, params = {}) {
    const log = this._log.child({
      ...this._getHashAndRangeKeyObj(item),
      meta: { params },
      method: 'put'
    })
    try {
      log.info('start')
      this._validateHashAndRangeKey(item)

      const req = {
        Item: item,
        ...params
      }

      const res = await this._db.put(req).promise()
      const data = res.Attributes
      log.debug({ data }, 'data')
      log.info('end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }

  async query(params) {
    const log = this._log.child({
      meta: { params },
      method: 'query'
    })
    try {
      log.info('start')
      const res = await this._db.query(params).promise()
      const data = {
        items: res.Items,
        count: res.Count,
        scannedCount: res.ScannedCount,
        lastEvaluatedKey: res.LastEvaluatedKey
      }
      log.debug({ data }, 'data')
      log.info('end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }

  async update(key, params = {}) {
    const log = this._log.child({
      ...this._getHashAndRangeKeyObj(key),
      meta: { key, params },
      method: 'update'
    })
    try {
      log.info('start')
      this._validateHashAndRangeKey(key)

      const req = {
        Key: key,
        ...params
      }

      const data = await this._db.update(req).promise()
      log.debug({ data }, 'data')
      log.info('end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }

  _validateHashAndRangeKey(item) {
    ac.assertNonWhiteSpaceString(item[this._hashKey], 'hashKey')
    if (this._rangeKey) {
      ac.assertNonWhiteSpaceString(item[this._rangeKey], 'rangeKey')
    }
  }

  _getHashAndRangeKeyObj(item) {
    return {
      ...(this._hashKey ? { [this._hashKey]: item[this._hashKey] } : {}),
      ...(this._rangeKey ? { [this._rangeKey]: item[this._rangeKey] } : {})
    }
  }
}
