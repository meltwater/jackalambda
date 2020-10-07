import ac from 'argument-contracts'

import { LambdaClient } from '../lib'

export class Factories {
  constructor(ctx, config) {
    this.config = config
    this._ctx = ctx
  }

  createTailLambdaClient() {
    const { tailLambdaArn } = this.config
    ac.assertNotNil(tailLambdaArn, 'tailLambdaArn')
    return new LambdaClient({
      arn: tailLambdaArn,
      ...this._ctx
    })
  }
}

export const createFactories = (...args) => new Factories(...args)
