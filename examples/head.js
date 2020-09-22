import { readJson } from '../lib'
import { handleInvoke } from '../handlers/head/processor'

export default ({ log }) => async (req = 'head') => {
  const event = await readJson('fixtures', `${req}.json`)
  return handleInvoke(event, {})
}
