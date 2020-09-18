import { v4 as uuidv4 } from 'uuid'

const httpVerbsWithBody = ['PATCH', 'POST', 'PUT']

/**
 * This parse will handle the following:
 * - Body parsed into a json object
 * - HTTP method as a string
 * - Path parameters as key value pairs, properly decoded from uri
 * - Query string parameters as multi-value entries. Object<string, Array<string>>
 * - reqId from the headers of the event, or a new requestId if one was not present
 *
 * @param {object} event - An event from Api Gateway -> Lambda Proxy Integration
 * @returns {object} The parsed event
 */
export function parseHttpEvent(event) {
  const {
    body,
    headers,
    httpMethod,
    multiValueQueryStringParameters,
    pathParameters
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

  return {
    body: parsedBody,
    httpMethod,
    pathParameters: decodedPathParameters,
    queryStringParameters: multiValueQueryStringParameters || {},
    reqId: headers['x-request-id'] || uuidv4()
  }
}
