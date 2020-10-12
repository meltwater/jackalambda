import { createConfigurationRepository } from '@meltwater/aws-configuration-fetcher'

export function getConfig(ctx, configurationRequests, cache) {
  const log = ctx.log.child({ isConfigLog: true })
  const configurationRepository = createConfigurationRepository({ cache, log })
  return configurationRepository.getConfiguration(configurationRequests)
}
