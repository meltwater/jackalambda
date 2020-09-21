// Fields derived from

import { SingleRecordSqsEvent } from './single-record-sqs-event'

// https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
export function parseMonoSqsEvent(sqsEvent) {
  if (sqsEvent.Records.length > 1) {
    throw new Error('More than one record was received for processing.')
  }

  const message = sqsEvent.Records[0].body

  return new SingleRecordSqsEvent({
    body: JSON.parse(message)
  })
}
