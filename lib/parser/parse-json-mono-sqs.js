import { SqsEvent } from './sqs-event'

// Fields derived from
// https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
export function parseJsonMonoSqsEvent(sqsEvent) {
  if (sqsEvent.Records.length > 1) {
    throw new Error('More than one record was received for processing.')
  }

  const body = sqsEvent.Records[0].body
  const parsedBody = JSON.parse(body)

  return new SqsEvent({
    body: parsedBody
  })
}
