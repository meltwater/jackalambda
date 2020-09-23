export const createProcessor = (factories, { log }) => async (
  event,
  context
) => {
  const tailLambdaClient = factories.createTailLambdaClient()
  return tailLambdaClient.invokeJson(event)
}
