export const createProcessor = ({ log }, container) => async (
  event,
  context
) => {
  const tailLambdaClient = container.createTailLambdaClient()
  return tailLambdaClient.invokeJson(event)
}
