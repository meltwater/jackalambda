// Fields derived from
// https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
export function parseMonoSqsEvent(sqsEvent) {
  if (sqsEvent.Records.length > 1) {
    throw new Error('More than one record was received for processing.')
  }

  const message = sqsEvent.Records[0]
  const requestIdAttribute = message.messageAttributes.reqId

  return {
    reqId: requestIdAttribute ? requestIdAttribute.StringValue : undefined,
    body: JSON.parse(message.body)
  }
}
