import { MultiStatusJsonResponse } from '../../lib'

export const createProcessor = ({ log }) => async (event, context) => {
  log.info('handled')

  if (event.body.throwError) {
    log.error('fail on purpose')
    const error = new Error('Throwing error to demonstrate wrapper')
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
