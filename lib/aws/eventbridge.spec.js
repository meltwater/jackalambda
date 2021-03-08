import test from 'ava'
import td from 'testdouble'
import createLogger from '@meltwater/mlabs-logger'

import { EventbridgeClient } from './eventbridge'

test.beforeEach((t) => {
  t.context.promise = td.function()
  t.context.createClient = (t) => {
    const client = new EventbridgeClient({
      eventBusName: 'ebus',
      reqId: 'a-req-id',
      log: createLogger({ t })
    })

    td.replace(client, '_eventbridge')

    return client
  }
})

test('should return event entries', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const promise = td.function()

  const events = [
    {
      source: 'the one',
      detailType: 'the type',
      detail: { foo: 'bar' },
      resources: ['anarn'],
      time: '2021'
    }
  ]

  const Events = [
    {
      EventBusName: 'ebus',
      Source: 'the one',
      DetailType: 'the type',
      Detail: JSON.stringify({ foo: 'bar' }),
      Resources: ['anarn'],
      Time: '2021'
    }
  ]

  td.when(client._eventbridge.putEvents({ Events })).thenReturn({ promise })

  td.when(promise()).thenResolve({
    FailedEntryCount: 0,
    Entries: [{ EventId: '123' }]
  })

  const res = await client.putEvents(events)

  t.is(res.length, 1)
  t.like(res[0], { eventId: '123' })
})

test('should throw failed entries error', async (t) => {
  const { createClient } = t.context
  const client = createClient(t)
  const promise = td.function()

  td.when(client._eventbridge.putEvents(td.matchers.anything())).thenReturn({
    promise
  })

  td.when(promise()).thenResolve({
    FailedEntryCount: 1,
    Entries: [
      {
        EventId: 'event-id',
        ErrorCode: 'error-code',
        ErrorMessage: 'error about stuff'
      }
    ]
  })
  const { code, data } = await t.throwsAsync(() => client.putEvents(), {
    message: /Failed to put 1/i
  })
  t.is(code, 'event_bus_failed_entries')
  t.is(data.length, 1)
  t.like(data[0], errorEntry)
})

const errorEntry = {
  eventId: 'event-id',
  errorCode: 'error-code',
  errorMessage: 'error about stuff'
}
