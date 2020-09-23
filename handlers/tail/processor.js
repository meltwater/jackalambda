export const createProcessor = (factories, { log }) => async (
  event,
  context
) => {
  log.info('handled')
  return event
}
