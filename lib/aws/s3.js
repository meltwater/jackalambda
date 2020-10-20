import ac from 'argument-contracts'
import { argName } from 'argument-contracts/arg-name'
import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

import { getAws } from './sdk'

/**
 * A wrapper around AWS.S3 to simplify interactions
 * @param {Object} options - See below
 * @param {string} options.bucket - The s3 Bucket
 * @param {string} options.name - The name to be used for the 'client' property on the logger
 * @param {string} options.reqId - The reqId used for distributed log tracing
 * @param {Object} options.log - A pino compatible logger
 * @param {Object} options.params - Additional parameters to the AWS.S3 constructor 'params' property
 */
export class S3Client {
  constructor({
    bucket,
    name = 's3',
    reqId = uuidv4(),
    log = createLogger(),
    params = {}
  }) {
    const defaultParams = { Bucket: bucket, ...params }
    const AWS = getAws()
    this._s3 = new AWS.S3({ params: defaultParams })
    this._reqId = reqId
    this._log = log.child({
      defaultParams,
      client: name,
      class: 'S3Client',
      reqId
    })
  }

  /**
   * getObject from S3 Bucket
   * @param {Object} key - The key to pass as the Key for s3Client.getObject
   * @param {Object} params - Additional properties to the s3.getObject method
   *
   * @returns {*} - The JSON response from s3.getObject
   */
  async getObjectJson(key, params = {}) {
    const log = this._log.child({
      meta: { key, params },
      method: 'getObject'
    })
    try {
      log.info('start')

      ac.assertNonWhiteSpaceString(key, argName({ key }))

      const req = {
        Key: key,
        ...params
      }

      const res = await this._s3.getObject(req).promise()
      const bodyString = res.Body.toString('utf-8')
      ac.assertNonWhiteSpaceString(bodyString, argName({ bodyString }))

      const data = JSON.parse(bodyString)
      log.debug({ data }, 'end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }
}
