import ac from 'argument-contracts'
import { argName } from 'argument-contracts/arg-name'

/**
 * An SQS Event
 * @property {Object} body - The body of the event
 */
export class SqsEvent {
  constructor({ body }) {
    ac.assertObject(body, argName({ body }))

    this.body = body

    Object.freeze(this)
  }
}
