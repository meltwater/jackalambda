export function getRequestIdHttp(event) {
  if (event.headers) {
    const requestId = Object.entries(event.headers)
      .filter(([key]) => key.toLowerCase() === 'x-request-id')
      .map(([_, requestId]) => requestId)

    if (requestId.length > 0) {
      return requestId[0]
    }
  }
}
