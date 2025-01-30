import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

import { getAws } from './sdk'

/** A basic POJO encapsulating sent message attributes
 * @param {Object} options
 * @param {string} options.messageId
 * @param {number} options.sequenceNumber
 *
 * @property {string} messageId
 * @property {number} sequenceNumber
 */
class SnsSendMessageResponse {
  constructor({ messageId, sequenceNumber }) {
    this.messageId = messageId
    this.sequenceNumber = sequenceNumber
    Object.freeze(this)
  }
}

/**
 * A wrapper around AWS.SNS to simplify interactions
 * @param {Object} options - See below
 * @param {string} options.topicArn - The ARN for the topic
 * @param {string} options.name - The name to be used for the 'client' property on the logger
 * @param {string} options.reqId - The reqId used for distributed log tracing
 * @param {Object} options.log - A pino compatible logger
 * @param {Object} options.params - Additional parameters to the AWS.Lambda constructor 'params' property
 */
export class SnsClient {
  constructor({
    topicArn,
    name = 'sns',
    reqId = uuidv4(),
    log = createLogger(),
    params = {}
  }) {
    const defaultParams = { TopicArn: topicArn, ...params }
    const AWS = getAws()
    this._sns = new AWS.SNS({ params: defaultParams })
    this._reqId = reqId
    this._log = log.child({
      defaultParams,
      client: name,
      class: 'SnsClient',
      reqId
    })
  }

  /**
   * Publish a message to SNS that will be JSON
   * @param {Object} body - The message body to be sent to SNS
   * @param {Object} params - Additional properties to the SnsClient.sendMessage method
   *
   * @returns {SnsSendMessageResponse} - Information about the message sent
   */
  async publishJson(body, params = {}) {
    const log = this._log.child({
      meta: { body, params },
      method: 'publishJson'
    })
    try {
      log.info('start')

      const req = {
        Message: JSON.stringify(body),
        ...params,
        MessageAttributes: {
          ...params.messageAttributes,
          reqId: {
            DataType: 'String',
            StringValue: this._reqId
          }
        }
      }

      const res = await this._sns.publish(req).promise()

      const data = new SnsSendMessageResponse({
        messageId: res.MessageId,
        sequenceNumber: res.SequenceNumber
      })

      log.info('end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }
}
