const httpVerbsWithBody = ['PATCH', 'POST', 'PUT']

export function parseHttpEvent(event) {
  const body = httpVerbsWithBody.includes(event.httpMethod)
    ? JSON.parse(event.body)
    : null

  return {
    headers: event.headers,
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
    httpMethod: event.httpMethod,
    body
  }
}
