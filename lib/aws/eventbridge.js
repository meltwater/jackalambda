import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

import { getAws } from './sdk'

/** A basic POJO encapsulating event bridge response entry
 * @param {Object} options
 * @param {string} options.eventId
 * @param {string} options.errorCode
 * @param {string} options.errorMessage
 *
 * @property {string} eventId
 * @property {string} errorCode
 * @property {string} errorMessage
 */
class EventbridgeReponseEntry {
  constructor({ eventId, errorCode, errorMessage }) {
    this.eventId = eventId
    this.errorCode = errorCode
    this.errorMessage = errorMessage
    Object.freeze(this)
  }
}

/**
 * A wrapper around AWS.EventBridge to simplify interactions
 * @param {Object} options - See below
 * @param {string} options.eventBusName - The events bus name.
 * @param {string} options.name - The name to be used for the 'client' property on the logger
 * @param {string} options.reqId - The reqId used for distributed log tracing
 * @param {Object} options.log - A pino compatible logger
 * @param {Object} options.params - Additional parameters to the AWS.EventBridge constructor 'params' property
 */
export class EventbridgeClient {
  constructor({
    eventBusName,
    name = 'eventbridge',
    reqId = uuidv4(),
    log = createLogger(),
    params = {}
  }) {
    const AWS = getAws()
    const defaultParams = params
    this._eventBusName = eventBusName
    this._eventbridge = new AWS.EventBridge({ params: defaultParams })
    this._reqId = reqId
    this._log = log.child({
      defaultParams,
      client: name,
      class: 'EventbridgeClient',
      eventBusName,
      reqId
    })
  }

  /**
   * Put events to the event bridge
   * @param {Object} events - The event entries to pass to eventbridge.Entries. Entry input structure is identical to the AWS Entry type, except all keys are in lower camelcase, the Detail should be a plain serializable object, and the EventBusName should be omitted.
   * @param {Object} params - Additional properties to pass to the eventbridge.putEvents method
   *
   * @returns {Array<EventbridgeReponseEntry>} - Array of EventbridgeReponseEntry
   */
  async putEvents(events = [], params = {}) {
    const log = this._log.child({
      meta: { params },
      method: 'putEvents'
    })
    try {
      log.info('start putEvents')

      const req = {
        Entries: events.map((event) => this._toEventRequest(event)),
        ...params
      }

      const res = await this._eventbridge.putEvents(req).promise()

      checkFailedEntries(res)
      const data = res.Entries.map(createEventResponse)

      log.info('end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }

  _toEventRequest(event) {
    return {
      EventBusName: this._eventBusName,
      Source: event.source,
      DetailType: event.detailType,
      Detail: JSON.stringify(event.detail),
      Resources: event.resources || [],
      ...(event.time ? { Time: event.time } : {})
    }
  }
}

const createEventResponse = (entry) =>
  new EventbridgeReponseEntry({
    eventId: entry.EventId,
    errorCode: entry.ErrorCode,
    errorMessage: entry.ErrorMessage
  })

const checkFailedEntries = (res) => {
  const { FailedEntryCount, Entries } = res
  if (FailedEntryCount === 0) return
  const err = new Error(`Failed to put ${FailedEntryCount} events`)
  err.data = Entries.map(createEventResponse)
  err.code = 'event_bus_failed_entries'
  throw err
}
