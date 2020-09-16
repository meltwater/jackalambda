const httpVerbsWithBody = ['PATCH', 'POST', 'PUT']

export function parseHttpEvent(event) {
  const body = httpVerbsWithBody.includes(event.httpMethod)
    ? JSON.parse(event.body)
    : null

  return {
    httpMethod: event.httpMethod,
    body
  }
}
