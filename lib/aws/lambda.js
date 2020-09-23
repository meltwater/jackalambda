import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'
import { applySpec, map, prop } from '@meltwater/phi'

import { Lambda } from './sdk'

export class LambdaClient {
  constructor({
    arn,
    name = 'lambda',
    reqId = uuidv4(),
    log = createLogger(),
    params = {}
  }) {
    const defaultParams = { FunctionName: arn, ...params }
    this._lambda = new Lambda({ params: defaultParams })
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

      const data = applySpec({
        ...map(prop, {
          payload: 'Payload',
          functionError: 'FunctionError',
          executedVersion: 'ExecutedVersion',
          statusCode: 'StatusCode'
        })
      })(res)

      log.debug({ data }, 'end')
      return JSON.parse(data.payload)
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }
}

const checkStatusCode = (statusCode) => {
  const is200StatusCode = statusCode > 199 && statusCode < 300

  if (is200StatusCode) return

  const err = new Error(`Status code error: ${statusCode}`)
  err.statusCode = statusCode
  throw err
}
