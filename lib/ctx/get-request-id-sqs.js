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
}
