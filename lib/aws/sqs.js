import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'
import { applySpec, map, prop } from '@meltwater/phi'

import { SQS } from './sdk'

export class SqsClient {
  constructor({
    queueUrl,
    name = 'sqs',
    reqId = uuidv4(),
    log = createLogger(),
    params = {}
  }) {
    const defaultParams = { QueueUrl: queueUrl, ...params }
    this._sqs = new SQS({ params: defaultParams })
    this._reqId = reqId
    this._log = log.child({
      defaultParams,
      client: name,
      class: 'SqsClient',
      reqId
    })
  }

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

      const res = await this._sqsClient.sendMessage(req).promise()

      const data = applySpec({
        ...map(prop, {
          body: 'MD5OfMessageBody',
          messageId: 'MessageId',
          messageAttributes: 'MD5OfMessageAttributes',
          sequenceNumber: 'SequenceNumber'
        })
      })(res)

      log.debug({ data }, 'end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }
}
