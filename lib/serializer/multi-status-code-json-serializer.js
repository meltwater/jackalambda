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
    this.data = body

    Object.freeze(this)
  }
}

/**
 * A serializer for handling statusCode and json object body responses
 *
 * @param {MultiStatusJsonResponse} response - The result from processor
 * @returns {Object} - Api gateway compatible response with statusCode, body, and contentType set appropriately
 */
export const multiStatusCodeJsonSerializer = (response) => ({
  statusCode: response.statusCode,
  body: JSON.stringify(response.body),
  headers: { 'Content-Type': 'application/json' }
})
