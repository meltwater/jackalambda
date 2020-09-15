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
    // This covers PATCH, POST, PUT - other http verbs will not have a body
    body
  }
}
