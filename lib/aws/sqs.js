import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

import { getAws } from './sdk'

/** A basic POJO encapsulating sent message attributes
 * @param {Object} options
 * @param {string} options.md5OfMessageBody
 * @param {string} options.messageId
 * @param {string} options.md5OfMessageAttributes
 * @param {number} options.sequenceNumber
 *
 * @property {string} md5OfMessageBody
 * @property {string} messageId
 * @property {string} md5OfMessageAttributes
 * @property {number} sequenceNumber
 */
class SqsSendMessageResponse {
  constructor({
    md5OfMessageBody,
    messageId,
    md5OfMessageAttributes,
    sequenceNumber
  }) {
    this.md5OfMessageBody = md5OfMessageBody
    this.messageId = messageId
    this.md5OfMessageAttributes = md5OfMessageAttributes
    this.sequenceNumber = sequenceNumber
    Object.freeze(this)
  }
}

/**
 * A wrapper around AWS.SQS to simplify interactions
 * @param {Object} options - See below
 * @param {string} options.queueUrl - The URL for the queue
 * @param {string} options.name - The name to be used for the 'client' property on the logger
 * @param {string} options.reqId - The reqId used for distributed log tracing
 * @param {Object} options.log - A pino compatible logger
 * @param {Object} options.params - Additional parameters to the AWS.Lambda constructor 'params' property
 */
export class SqsClient {
  constructor({
    queueUrl,
    name = 'sqs',
    reqId = uuidv4(),
    log = createLogger(),
    params = {}
  }) {
    const defaultParams = { QueueUrl: queueUrl, ...params }
    const AWS = getAws()
    this._sqs = new AWS.SQS({ params: defaultParams })
    this._reqId = reqId
    this._log = log.child({
      defaultParams,
      client: name,
      class: 'SqsClient',
      reqId
    })
  }

  /**
   * Publish a message to SQS that will be JSON
   * @param {Object} input - The message body to be sent to SQS
   * @param {Object} params - Additional properties to the sqsClient.sendMessage method
   *
   * @returns {SqsSendMessageResponse} - Information about the message sent
   */
  async publishJson(input, params = {}) {
    const log = this._log.child({
      meta: { input, params },
      method: 'send'
    })
    try {
      log.info('start')

      const req = {
        MessageBody: JSON.stringify(input),
        ...params,
        MessageAttributes: {
          ...params.messageAttributes,
          reqId: {
            DataType: 'String',
            StringValue: this._reqId
          }
        }
      }

      const res = await this._sqs.sendMessage(req).promise()

      const data = new SqsSendMessageResponse({
        md5OfMessageBody: res.MD5OfMessageBody,
        messageId: res.MessageId,
        md5OfMessageAttributes: res.MD5OfMessageAttributes,
        sequenceNumber: res.SequenceNumber
      })

      log.debug({ data }, 'end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }
}
