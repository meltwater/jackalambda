import { SqsEvent } from './sqs-event'

// Fields derived from
// https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
/**
 * Parse a Lambda SQS event
 * @param {Object} sqsEvent - A Lambda SQS event
 *
 * @returns {SqsEvent} - The parsed SQS event
 */
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
