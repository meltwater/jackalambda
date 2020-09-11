import ac from 'argument-contracts'
import {
  ConfigurationRequest,
  ConfigurationRequestTypes
} from '@meltwater/aws-configuration-fetcher'

const createStringConfigurationRequest = (propertyName, key) =>
  new ConfigurationRequest({
    adapter: (value) => {
      ac.assertString(value, propertyName)
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
