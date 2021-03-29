const defaultPaths = ['data', 'body', 'meta', 'requestContext']
const createRedactionList = (keys, paths = defaultPaths) => {
  const redact = []

  keys.forEach((key) => {
    const keyNotation = isBracketNotation(key) ? '' : '.'
    redact.push(key)
    redact.push(`*${keyNotation}${key}`)
    paths.forEach((path) => {
      redact.push(`${path}.*${keyNotation}${key}`)
      redact.push(`*.${path}${keyNotation}${key}`)
    })
  })
  return redact
}

const isBracketNotation = (key) => key.startsWith('["') && key.endsWith('"]')

/**
 * A collection of logger redactions for common sensitive property paths.
 */
export const LOGGER_REDACTION_LISTS = {
  API_KEY: createRedactionList(['apiKey', '["x-api-key"]']),
  AUTHORIZATION: createRedactionList(['authorization', 'Authorization']),
  PASSCODE: createRedactionList(['passcode']),
  PASSWORD: createRedactionList(['password']),
  TOKEN: createRedactionList(['token'])
}
