import { MultiStatusJsonResponse } from '../../lib'

export const createProcessor = ({ log }) => async (event, context) => {
  if (event.body.throwError) {
    log.warn('Event body set throwError true')
    const error = new Error(
      'Throwing error for demonstration since throwError is true'
    )
    error.statusCode = event.body.statusCode
    throw error
  }

  return new MultiStatusJsonResponse({
    statusCode: 200,
    body: event
  })
}
