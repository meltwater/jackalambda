import { v4 as uuidv4 } from 'uuid'

export function getRequestIdHttp(event) {
  if (event.headers) {
    const requestId = Object.entries(event.headers)
      .filter(([key]) => key.toLowerCase() === 'x-request-id')
      .map(([_, requestId]) => requestId)

    if (requestId.length) {
      return requestId[0]
    }
  }

  return uuidv4()
}
