// Fields derived from
// https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
export function parseSqsEvent(sqsEvent) {
  if (sqsEvent.Records.length > 1) {
    throw new Error('More than one record was received for processing.')
  }

  const requestId = sqsEvent.Records[0].messageAttributes.reqId

  return {
    reqId: requestId ? requestId.stringValue : undefined,
    body: JSON.parse(sqsEvent.Records[0].body)
  }
}
