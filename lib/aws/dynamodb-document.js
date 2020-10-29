import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

import { getAws } from './sdk'

export class DynamodbDocumentClient {
  constructor({
    table,
    name = 'dynamodb-document',
    reqId = uuidv4(),
    log = createLogger(),
    params = {}
  }) {
    const defaultParams = { TableName: table, ...params }
    const AWS = getAws()
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
      ...key,
      meta: { key, params },
      method: 'get'
    })
    try {
      log.info('start')

      const req = {
        Key: key,
        ...params
      }

      const res = await this._db.get(req).promise()
      const data = res.Item
      log.debug({ data }, 'end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }

  async put(key, item = {}, params = {}) {
    const log = this._log.child({
      ...key,
      meta: { params },
      method: 'put'
    })
    try {
      log.info('start')

      const req = {
        Item: { ...key, ...item },
        ...params
      }

      const res = await this._db.put(req).promise()
      const data = res.Attributes
      log.debug({ data }, 'end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }
}
