const httpVerbsWithBody = ['PATCH', 'POST', 'PUT']

export function parseHttpEvent(event) {
  const body = httpVerbsWithBody.includes(event.httpMethod)
    ? JSON.parse(event.body)
    : null

  const { headers } = event

  return {
    reqId: headers['x-request-id'] || undefined,
    httpMethod: event.httpMethod,
    body
  }
}
