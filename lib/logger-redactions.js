const defaultPaths = ['data', 'body', 'meta', 'requestContext']
const createRedactionList = (keys, paths = defaultPaths) => {
  const redact = []

  keys.forEach((key) => {
    redact.push(key)
    redact.push('*'.concat('.', key))
  })

  paths.forEach((path) => {
    keys.forEach((key) => {
      redact.push([path, '*', key].join('.'))
      redact.push(['*', path, key].join('.'))
    })
  })

  return redact
}

/**
 * A collection of logger redactions for common sensitive property paths.
 */
export const LOGGER_REDACTION_LISTS = {
  API_KEY: createRedactionList(['apiKey', 'x-api-key']),
  AUTHORIZATION: createRedactionList(['authorization', 'Authorization']),
  PASSCODE: createRedactionList(['passcode']),
  PASSWORD: createRedactionList(['password']),
  TOKEN: createRedactionList(['token'])
}
