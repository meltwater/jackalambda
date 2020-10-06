/**
 * Get the reqId from an HTTP lambda event
 * @private
 *
 * @param {Object} event - Lambda HTTP event
 *
 * @returns {string|undefined} - The reqId if it exists, undefined otherwise
 */
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
