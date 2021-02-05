import { parse as cookieParse } from 'cookie'

import { HttpEvent } from './http-event'

const httpVerbsWithBody = ['PATCH', 'POST', 'PUT']

/**
 * This parse will handle the following:
 * - Body parsed into a json object
 * - HTTP method as a string
 * - Path parameters as key value pairs, properly decoded from uri
 * - Query string parameters as multi-value entries. Object<string, Array<string>>
 * - Headers as multi-value entries. Object<string, Array<string>>
 * - Request context
 * - Cookies
 *
 * @param {object} event - An event from Api Gateway -> Lambda Proxy Integration
 * @returns {HttpEvent} The parsed event
 */
export function parseJsonHttpEvent(event) {
  const {
    body,
    httpMethod,
    multiValueQueryStringParameters,
    multiValueHeaders,
    pathParameters,
    requestContext
  } = event

  const parsedBody = httpVerbsWithBody.includes(httpMethod)
    ? JSON.parse(body)
    : {}

  const decodedPathParameters = {}
  if (pathParameters) {
    for (const [key, value] of Object.entries(pathParameters)) {
      decodedPathParameters[key] = decodeURIComponent(value)
    }
  }

  const normalizedHeaders = {}
  if (multiValueHeaders) {
    for (const [key, value] of Object.entries(multiValueHeaders)) {
      normalizedHeaders[key.toLowerCase()] = value
    }
  }

  return new HttpEvent({
    body: parsedBody,
    httpMethod,
    pathParameters: decodedPathParameters,
    queryStringParameters: multiValueQueryStringParameters || {},
    headers: normalizedHeaders || {},
    requestContext: requestContext || {},
    cookies: getCookies(normalizedHeaders)
  })
}

const getCookies = (headers) => {
  if (!headers) return {}
  if (!headers.cookie) return {}
  if (!headers.cookie[0]) return {}
  return cookieParse(headers.cookie[0])
}
