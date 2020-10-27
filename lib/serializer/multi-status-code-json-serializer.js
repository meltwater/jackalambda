import ac from 'argument-contracts'
import { argName } from 'argument-contracts/arg-name'

/**
 * A json response with statusCode
 *
 * @param {number} statusCode - The statusCode of the response
 * @param {Object} body - The json object body of the response
 */
export class MultiStatusJsonResponse {
  constructor({ statusCode, body }) {
    ac.assertNumber(statusCode, argName({ statusCode }))
    ac.assertObject(body, argName({ body }))

    this.statusCode = statusCode
    this.body = body

    Object.freeze(this)
  }
}

/**
 * A serializer for handling statusCode and json object body responses
 *
 * @param {MultiStatusJsonResponse} response - The result from processor
 * @param {AppContext} ctx - The context of the current execution
 * @returns {Object} - Api gateway compatible response with statusCode, body, and headers set appropriately
 */
export const multiStatusCodeJsonSerializer = (response, ctx) => ({
  statusCode: response.statusCode,
  body: JSON.stringify(response.body),
  headers: {
    'Content-Type': 'application/json',
    'x-request-id': ctx.reqId
  }
})
