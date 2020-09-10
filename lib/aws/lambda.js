import { v4 as uuidv4 } from 'uuid'

import { AWS } from './sdk'

export class LambdaClient {
  constructor({ name, arn, reqId = uuidv4(), log }) {
    this._lambda = new AWS.Lambda({
      params: { FunctionName: arn }
    })
    this._reqId = reqId
    this._log = log.child({ client: name, class: 'LambdaClient', reqId })
  }

  async invokeJson(meta) {
    const log = this._log.child({ method: 'invokeJson' })
    try {
      log.info({ meta }, 'start')

      const params = {
        Payload: JSON.stringify(meta)
      }

      const res = await this._lambda.invoke(params).promise()

      checkStatusCode(res.StatusCode)

      const data = JSON.parse(res.Payload)
      log.debug({ meta }, 'end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }
}

const checkStatusCode = (statusCode) => {
  const is200StatusCode = statusCode > 200 && statusCode < 299

  if (is200StatusCode) return

  const err = new Error(`Status code error: ${statusCode}`)
  err.statusCode = statusCode
  throw err
}
