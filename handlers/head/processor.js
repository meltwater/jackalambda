export const createProcessor = ({ log }, factories) => async (
  event,
  context
) => {
  const tailLambdaClient = factories.createTailLambdaClient()
  return tailLambdaClient.invokeJson(event)
}
