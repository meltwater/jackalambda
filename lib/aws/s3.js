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
   * upload to S3 Bucket
   * @param {Object} key - The key to pass as the Key for s3Client.upload
   * @param {Object} body - The object passed as the Body for s3Client.upload
   * @param {Object} params - Additional properties to the s3.upload method
   *
   * @returns {Promise<void>}
   */
  async upload(key, body, params = {}) {
    const log = this._log.child({
      meta: { key, params },
      method: 'upload'
    })
    try {
      log.info('start')

      ac.assertNonWhiteSpaceString(key, argName({ key }))

      const req = {
        Key: key,
        Body: body,
        Metadata: {
          'x-request-id': this._reqId
        },
        ...params
      }

      await this._s3.upload(req).promise()

      log.info('end')
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }

  /**
   * upload JSON to S3 Bucket
   * @param {Object} key - The key to pass to this.upload
   * @param {Object} body - The object to be stringified and passed to this.upload
   * @param {Object} params - Additional properties to pass to this.upload
   *
   * @returns {Promise<void>}
   */
  async uploadJson(key, body, params = {}) {
    const log = this._log.child({
      meta: { key, params },
      method: 'uploadJson'
    })
    try {
      log.info('start')

      await this.upload(key, JSON.stringify(body), {
        ...params,
        ContentType: 'application/json'
      })

      log.info('end')
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }

  /**
   * getObject from S3 Bucket
   * @param {Object} key - The key to pass as the Key for s3Client.getObject
   * @param {Object} params - Additional properties to the s3.getObject method
   *
   * @returns {*} - The Body of response from s3.getObject
   */
  async getObject(key, params = {}) {
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

      const data = await this._s3.getObject(req).promise()

      log.info('end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }

  /**
   * getObjectJson from S3 Bucket
   * @param {Object} key - The key to pass to this.getObject
   * @param {Object} params - Additional properties to pass to this.getObject
   *
   * @returns {*} - The JSON response from s3.getObject
   */
  async getObjectJson(key, params = {}) {
    const log = this._log.child({
      meta: { key, params },
      method: 'getObjectJson'
    })
    try {
      log.info('start')

      const res = await this.getObject(key, params)
      const data = parseResAsJson(res)

      log.info('end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }

  /**
   * listObjectVersions from S3 Bucket
   * @param {Object} params - Additional properties to pass to s3.listObjectVersions
   *
   * @returns {*} - The response from s3.listObjectVersions
   */
  async listObjectVersions(params = {}) {
    const log = this._log.child({
      meta: { params },
      method: 'listObjectVersions'
    })
    try {
      log.info('start')

      const data = await this._s3.listObjectVersions(params).promise()

      log.info('end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }

  /**
   * deleteObjects from S3 Bucket
   * @param {Object} params - Properties to pass to s3.deleteObjects
   *
   * @returns {*} - The response from s3.deleteObjects
   */
  async deleteObjects(params = {}) {
    const log = this._log.child({
      meta: { params },
      method: 'deleteObjects'
    })
    try {
      log.info('start')

      const data = await this._s3.deleteObjects(params).promise()

      log.info('end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }
}

const parseResAsJson = (res) => {
  try {
    const bodyString = res.Body.toString('utf-8')
    ac.assertNonWhiteSpaceString(bodyString, argName({ bodyString }))
    return JSON.parse(bodyString)
  } catch (err) {
    throw new Error('Could not parse Body as JSON')
  }
}
