import { readJson } from '../lib'
import { handleInvoke } from '../handlers/head/processor'

export default ({ log }) => async (req = 'head') => {
  process.env.AWS_SDK_LOAD_CONFIG = 'true'
  process.env.IS_LOCAL = 'true'
  const event = await readJson('fixtures', `${req}.json`)
  return handleInvoke(event, {})
}
