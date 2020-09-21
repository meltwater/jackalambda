import { v4 as uuidv4 } from 'uuid'

export function getRequestIdSqs(event) {
  if (
    event.Records &&
    event.Records.length &&
    event.Records[0].messageAttributes &&
    event.Records[0].messageAttributes.reqId &&
    event.Records[0].messageAttributes.reqId.StringValue
  ) {
    return event.Records[0].messageAttributes.reqId.StringValue
  }

  return uuidv4()
}
