import { createSsmStringConfigurationRequest } from '@meltwater/aws-configuration-fetcher'

export const configurationRequests = [
  createSsmStringConfigurationRequest(
    'tailLambdaArn',
    process.env.SSM_TAIL_LAMBDA_ARN
  )
]
