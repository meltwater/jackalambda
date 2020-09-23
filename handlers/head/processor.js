export const createProcessor = (factories, { log }) => async (
  event,
  context
) => {
  const tailLambdaClient = factories.getTailLambdaClient()
  return tailLambdaClient.invokeJson(event)
}
