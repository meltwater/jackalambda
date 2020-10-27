import { MultiStatusJsonResponse } from '../../lib'

export const createProcessor = ({ log }) => async (event, context) => {
  if (event.body.throwError) {
    const error = new Error('Throwing error for demonstration since throwError is true')
    if (event.body.statusCode) {
      error.statusCode = event.body.statusCode
    }
    throw error
  }

  return new MultiStatusJsonResponse({
    statusCode: 200,
    body: event
  })
}
