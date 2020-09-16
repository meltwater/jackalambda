import { createConfigurationRepository } from '@meltwater/aws-configuration-fetcher'

export const getConfig = (configurationRequests, cache, ctx) => {
  const { log } = ctx
  const configurationRepository = createConfigurationRepository({ cache, log })
  return configurationRepository.getConfiguration(configurationRequests)
}
