export const createProcessor = ({ log }) => async (event, context) => {
  log.info('handled')

  if (event.body.throwError) {
    log.error('fail on purpose')
    throw new Error('Throwing error to demonstrate wrapper')
  }

  log.info('success response')
  return {
    statusCode: 200,
    event
  }
}
