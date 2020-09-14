export function parseHttpEvent(event) {
  return {
    headers: event.headers,
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
    httpMethod: event.httpMethod,
    // This covers PATCH, POST, PUT - other http verbs will not have a body
    body: event.httpMethod.startsWith('P') ? JSON.parse(event.body) : undefined
  }
}
