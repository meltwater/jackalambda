import { v4 as uuidv4 } from 'uuid'

export function getRequestIdHttp(event) {
  if (event.headers && event.headers['x-request-id']) {
    return event.headers['x-request-id']
  }

  return uuidv4()
}
