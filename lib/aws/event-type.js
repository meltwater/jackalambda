const eventType = {
  cloudfront: 'cloudfront',
  awsConfig: 'awsConfig',
  codeCommit: 'codeCommit',
  apiGatewayAuthorizer: 'apiGatewayAuthorizer',
  cloudFormation: 'cloudFormation',
  ses: 'ses',
  apiGatewayAwsProxy: 'apiGatewayAwsProxy',
  scheduledEvent: 'scheduledEvent',
  cloudWatchLogs: 'cloudWatchLogs',
  sns: 'sns',
  dynamoDb: 'dynamoDb',
  kinesisFirehose: 'kinesisFirehose',
  cognitoSyncTrigger: 'cognitoSyncTrigger',
  kinesis: 'kinesis',
  s3: 's3',
  mobileBackend: 'mobileBackend',
  sqs: 'sqs'
}

export const EventType = {
  ...eventType,
  isValid: (possibleType) => Object.values(eventType).includes(possibleType)
}
