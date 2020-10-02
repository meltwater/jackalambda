import ac from 'argument-contracts'
import { argName } from 'argument-contracts/arg-name'

/**
 * Parse an HTTP Lambda event
 * @param {Object} options - See below
 * @param {Object} options.body - The body of the event
 * @param {string} options.httpMethod - String name of the http method
 * @param {Object<string, string>} options.pathParameters - An object of path part name, value pairs
 * @param {Object<string, Array<string>>} options.queryStringParameters - An object of parameter name, array of values pairs
 *
 * @property {Object} body - The body of the event
 * @property {string} httpMethod - String name of the http method
 * @property {Object<string, string>} pathParameters - An object of path part name, value pairs
 * @property {Object<string, Array<string>>} queryStringParameters - An object of parameter name, array of values pairs
 */
export class HttpEvent {
  constructor({ body, httpMethod, pathParameters, queryStringParameters }) {
    ac.assertObject(body, argName({ body }))
    ac.assertNonWhiteSpaceString(httpMethod, argName({ httpMethod }))
    ac.assertObject(pathParameters, argName({ pathParameters }))
    ac.assertObject(queryStringParameters, argName({ queryStringParameters }))

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

    Object.freeze(this)
  }
}
