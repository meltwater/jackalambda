import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

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

  async send(input, params = {}) {
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

      await this._sqsClient.sendMessage(req).promise()

      log.debug('end')
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }
}
