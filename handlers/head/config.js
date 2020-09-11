import ac from 'argument-contracts'
import {
  ConfigurationRequest,
  ConfigurationRequestTypes
} from '@meltwater/aws-configuration-fetcher'

// UPSTREAM: Want this function.
const createStringConfigurationRequest = (propertyName, key) =>
  new ConfigurationRequest({
    adapter: (value) => {
      ac.assertNonWhiteSpaceString(value, propertyName)
      return value
    },
    key,
    propertyName,
    type: ConfigurationRequestTypes.ssm
  })

export const configurationRequests = [
  createStringConfigurationRequest(
    'tailLambdaArn',
    process.env.SSM_TAIL_LAMBDA_ARN
  )
]
