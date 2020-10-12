export const createProcessor = ({ log }) => async (event, context) => {
  log.info('handled')
  return event
}
