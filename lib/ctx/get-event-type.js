import { EventType } from './event-type'

/**
 * Figure out the type of lambda event based on its event object
 * @private
 *
 * @param {Object} event - The lambda event
 *
 * @returns {string}
 */
export function getEventType(event) {
  if (event.Records && event.Records[0].cf) {
    return EventType.cloudfront
  }

  if (event.configRuleId && event.configRuleName && event.configRuleArn) {
    return EventType.awsConfig
  }

  if (event.Records && event.Records[0].eventSource === 'aws:codecommit') {
    return EventType.codeCommit
  }

  if (event.authorizationToken === 'incoming-client-token') {
    return EventType.apiGatewayAuthorizer
  }

  if (event.StackId && event.RequestType && event.ResourceType) {
    return EventType.cloudFormation
  }

  if (event.Records && event.Records[0].eventSource === 'aws:ses') {
    return EventType.ses
  }

  if (event.pathParameters && event.pathParameters.proxy) {
    return EventType.apiGatewayAwsProxy
  }

  if (
    event.resource &&
    event.path &&
    event.httpMethod &&
    event.headers &&
    event.headers.Host
  ) {
    return EventType.apiGatewayLambdaIntegration
  }

  if (event.source === 'aws.events') {
    return EventType.scheduledEvent
  }

  if (event.awslogs && event.awslogs.data) {
    return EventType.cloudWatchLogs
  }

  if (event.Records && event.Records[0].EventSource === 'aws:sns') {
    return EventType.sns
  }

  if (event.Records && event.Records[0].eventSource === 'aws:dynamodb') {
    return EventType.dynamoDb
  }

  if (event.records && event.records[0].approximateArrivalTimestamp) {
    return EventType.kinesisFirehose
  }

  if (
    event.records &&
    event.deliveryStreamArn &&
    event.deliveryStreamArn.startsWith('arn:aws:kinesis:')
  ) {
    return EventType.kinesisFirehose
  }

  if (
    event.eventType === 'SyncTrigger' &&
    event.identityId &&
    event.identityPoolId
  ) {
    return EventType.cognitoSyncTrigger
  }

  if (event.Records && event.Records[0].eventSource === 'aws:kinesis') {
    return EventType.kinesis
  }

  if (event.Records && event.Records[0].eventSource === 'aws:s3') {
    return EventType.s3
  }

  if (event.operation && event.message) {
    return EventType.mobileBackend
  }

  if (event.Records && event.Records[0].eventSource === 'aws:sqs') {
    return EventType.sqs
  }

  return EventType.lambda
}
