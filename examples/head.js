import { readJson, LambdaClient } from '../lib'

process.env.AWS_SDK_LOAD_CONFIG = 'true'

export default ({ headLambdaArn, log }) => async (req = 'head') => {
  const input = await readJson('fixtures', `${req}.json`)
  const client = new LambdaClient({
    name: 'head',
    arn: headLambdaArn,
    log
  })
  return client.invokeJson(input)
}
