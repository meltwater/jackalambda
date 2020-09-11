import { LambdaClient } from '../lib'

export class Factories {
  constructor(config, ctx) {
    this.config = config
    this._ctx = ctx
  }

  getTailLambdaClient() {
    const { tailLambdaArn } = this.config
    if (!tailLambdaArn) throw new Error('Missing tailLambdaArn')
    return new LambdaClient({
      arn: tailLambdaArn,
      ...this._ctx
    })
  }
}

export const createFactories = (...args) => new Factories(...args)
