import ac from 'argument-contracts'
import { argName } from 'argument-contracts/arg-name'

/**
 * @property {object} body - The body of the event
 */
export class HttpEvent {
  constructor({
    body,
    httpMethod,
    pathParameters,
    queryStringParameters,
    reqId
  }) {
    ac.assertObject(body, argName({ body }))
    ac.assertNonWhiteSpaceString(httpMethod, argName({ httpMethod }))
    ac.assertObject(pathParameters, argName({ pathParameters }))
    ac.assertObject(queryStringParameters, argName({ queryStringParameters }))
    ac.assertNonWhiteSpaceString(reqId, argName({ reqId }))

    Object.entries(pathParameters).forEach(([key, value]) =>
      ac.assertString(value, `pathParameters[${key}]`)
    )

    Object.entries(queryStringParameters).forEach(([key, value]) =>
      ac.assertArrayOf(value, String, `pathParameters[${key}]`)
    )

    this.body = body
    this.httpMethod = httpMethod
    this.pathParameters = pathParameters
    this.queryStringParameters = queryStringParameters
    this.reqId = reqId

    Object.freeze(this)
  }
}
