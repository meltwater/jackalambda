/** The possible types of events */
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
  sqs: 'sqs',
  lambda: 'lambda'
}

/** The different types of events that can occur
 * @property {string} cloudfront
 * @property {string} awsConfig
 * @property {string} codeCommit
 * @property {string} apiGatewayAuthorizer
 * @property {string} cloudFormation
 * @property {string} ses
 * @property {string} apiGatewayAwsProxy
 * @property {string} scheduledEvent
 * @property {string} cloudWatchLogs
 * @property {string} sns
 * @property {string} dynamoDb
 * @property {string} kinesisFirehose
 * @property {string} cognitoSyncTrigger
 * @property {string} kinesis
 * @property {string} s3
 * @property {string} mobileBackend
 * @property {string} sqs
 * @property {string} lambda
 * @property {Function} isValid - Return true if provided value is a valid event type, false otherwise
 */
export const EventType = {
  ...eventType,
  isValid: (possibleType) => Object.values(eventType).includes(possibleType)
}
