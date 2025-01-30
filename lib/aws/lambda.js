import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

import { getAws } from './sdk'

/**
 * A wrapper around AWS.Lambda to simplify interactions
 * @param {Object} options - See below
 * @param {string} options.arn - The ARN of the lambda to invoke
 * @param {string} options.name - The name to be used for the 'client' property on the logger
 * @param {string} options.reqId - The reqId used for distributed log tracing
 * @param {Object} options.log - A pino compatible logger
 * @param {Object} options.params - Additional parameters to the AWS.Lambda constructor 'params' property
 */
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

  /**
   * Invoke the lambda
   * @param {Object} payload - The object to pass as the Payload for lambdaClient.invoke
   * @param {Object} params - Additional properties to the lambdaClient.invoke method
   *
   * @returns {*} - The JSON parsed response from lambdaClient.invoke
   */
  async invokeJson(payload, params = {}) {
    const log = this._log.child({
      meta: { payload, params },
      method: 'invokeJson'
    })
    try {
      log.info('start')

      const req = {
        Payload: JSON.stringify({ ...payload, reqId: this._reqId }),
        ...params
      }

      const res = await this._lambda.invoke(req).promise()
      const statusCode = res.StatusCode

      checkStatusCode(statusCode)
      checkFunctionError(res)

      const data = JSON.parse(res.Payload)
      log.info({ statusCode }, 'end')
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
