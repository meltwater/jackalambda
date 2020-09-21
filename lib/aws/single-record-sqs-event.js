import ac from 'argument-contracts'
import { argName } from 'argument-contracts/arg-name'

export class SingleRecordSqsEvent {
  constructor({ body }) {
    ac.assertObject(body, argName({ body }))

    this.body = body

    Object.freeze(this)
  }
}
