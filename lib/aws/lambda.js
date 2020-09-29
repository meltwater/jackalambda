import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

import { getAws } from './sdk'

export class LambdaClient {
  constructor({
    arn,
    name = 'lambda',
    reqId = uuidv4(),
    log = createLogger(),
    params = {}
  }) {
    const defaultParams = { FunctionName: arn, ...params }
    const AWS = getAws()
    this._lambda = new AWS.Lambda({ params: defaultParams })
    this._reqId = reqId
    this._log = log.child({
      defaultParams,
      client: name,
      class: 'LambdaClient',
      reqId
    })
  }

  async invokeJson(input, params = {}) {
    const log = this._log.child({
      meta: { input, params },
      method: 'invokeJson'
    })
    try {
      log.info('start')

      const req = {
        Payload: JSON.stringify({ ...input, reqId: this._reqId }),
        ...params
      }

      const res = await this._lambda.invoke(req).promise()

      checkStatusCode(res.StatusCode)
      checkFunctionError(res)

      const data = JSON.parse(res.Payload)
      log.debug({ data, statusCode: res.StatusCode }, 'end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }
}

// NOTE: https://docs.amazonaws.cn/en_us/lambda/latest/dg/nodejs-exceptions.html
const checkStatusCode = (statusCode) => {
  const is200StatusCode = statusCode > 199 && statusCode < 300

  if (is200StatusCode) return

  const err = new Error(`Status code error: ${statusCode}`)
  err.statusCode = statusCode
  throw err
}

// NOTE: https://docs.amazonaws.cn/en_us/lambda/latest/dg/nodejs-exceptions.html
const checkFunctionError = (res) => {
  if (!res.FunctionError) return
  const data = JSON.parse(res.Payload)
  const err = new Error('Lambda function error')
  err.data = data
  err.code = 'lambda_function_error'
  throw err
}
