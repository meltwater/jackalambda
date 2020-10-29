export const createProcessor = ({ log }) => async (event, context) => {
  log.info('Jackalambda')
  return event
}
