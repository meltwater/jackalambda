# Jackalambda

[![Drone](https://drone.meltwater.io/api/badges/meltwater/jackalambda/status.svg?branch=master)](https://drone.meltwater.io/meltwater/jackalambda)

Mythical lambda creature.

## Description

Toolkit for writing production ready Lambda functions.

Jackalambda provides a consistent way to write Lambda handlers
that let you focus on the business logic of you function and none of the boilerplate.

With Jackalambda, you get:

- Consistent [JSON logging][@meltwater/mlabs-logger].
- [Cached remote secrets and configuration][@meltwater/aws-configuration-fetcher].
- AWS event detection and parsing.
- X-Ray enhanced clients for common AWS services.
- Distributed request id support.
- Isolated side effects for fully testable handlers.
- [AVA] logging integration.

All Jackalambda handlers follow a clear execution path:

1. Resolve and validate all required configuration, or fail with a clear error.
2. Isolate all side-effect producing dependencies in a container with their configuration.
3. Run a processor function with a reference to the container.
4. Ensure the logger is always available, scoped per-request, and always logs failures,
   event fatal ones.

### Example

_This project is a fully working,
real world, example of using Jackalambda.
Just check out the `handlers` folder._

Creating your first handler is this simple:

```js
import { createHandler } from '@meltwater/jackalambda'

export handler = createHandler({
  createProcessor: ({ log }) => (event, context) => {
    log.info({ meta: event }, 'I 💖 Jackalambda')
    return { success: true }
  }
})
```

And here is how to add a side-effect that calls another lambda
where the lambda ARN is stored in SSM:

```js
import { createHandler, LambdaClient } from '@meltwater/jackalambda'
import { createSsmStringConfigurationRequest } from '@meltwater/aws-configuration-fetcher'

export handler = createHandler({
  configurationRequests: [
    createSsmStringConfigurationRequest(
      'otherLambdaArn',
      process.env.OTHER_LAMBDA_ARN_SSM_PATH
    )
  ],
  createContainer: (ctx, { otherLambdaArn }) => ({
    otherLambdaClient: new LambdaClient({ arn: otherLambdaArn, ...ctx })
  }),
  createProcessor: ({ log }, { otherLambdaClient }) => (event, context) => {
    log.info({ meta: event }, 'I 💖 Jackalambda')
    return otherLambdaClient.invokeJson(event)
  }
})
```

[AVA]: https://github.com/avajs/ava
[@meltwater/aws-configuration-fetcher]: https://github.com/meltwater/aws-configuration-fetcher
[@meltwater/mlabs-logger]: https://github.com/meltwater/mlabs-logger

## Installation

Add this as a dependency to your project using [npm] with

```
$ npm install @meltwater/jackalambda
```

or using [Yarn] with

```
$ yarn add @meltwater/jackalambda
```

[npm]: https://www.npmjs.com/
[Yarn]: https://yarnpkg.com/

## Usage

For a full set of documentation check out the [docs]!

[docs]: /docs/README.md

## Development and Testing

### Quickstart

```
$ git clone https://github.com/meltwater/jackalambda.git serverless-nodejs
$ cd serverless-nodejs
$ nvm install
$ yarn install
```

Run each command below in a separate terminal window:

```
$ yarn run offline
$ yarn run test:watch
```

Primary development tasks are defined under `scripts` in `package.json`
and available via `yarn run`.
View them with

```
$ yarn run
```

### Source code

The [source code] is hosted on GitHub.
Clone the project with

```
$ git clone git@github.com:meltwater/jackalambda.git
```

[source code]: https://github.com/meltwater/jackalambda

### Requirements

You will need [Node.js] with [npm], [Yarn], and a [Node.js debugging] client.

Be sure that all commands run under the correct Node version, e.g.,
if using [nvm], install the correct version with

```
$ nvm install
```

Set the active version for each shell session with

```
$ nvm use
```

Install the development dependencies with

```
$ yarn install
```

[Node.js]: https://nodejs.org/
[Node.js debugging]: https://nodejs.org/en/docs/guides/debugging-getting-started/
[npm]: https://www.npmjs.com/
[nvm]: https://github.com/creationix/nvm

#### Drone

_Drone should already be configured: this section is for reference only._

The following secrets must be set on [Drone].
These may be set manually or by running the script `./.drone/secrets.sh`.

Note the Drone config path must be set to `.drone/config.yml`
after the repo is activated.

##### npm

- `npm_token_ro`: npm token for installing packages.
- `npm_token_rw`: npm token for publishing packages.
- `npm_team`: npm team to grant read-only package access
  (format `org:team`, optional).

##### Slack

- `slack_webhook`: Slack webhook for build notifications.

##### Drone Promotion

When the drone build publishes a new package version it can trigger
a promotion event on a Drone repo.

- `drone_server`: Drone server.
- `drone_token`: Drone token.

##### AWS S3 Release

- `aws_assume_role_arn_staging`: The AWS role to assume for staging.
- `aws_assume_role_external_id_staging`: The external ID for the AWS role for staging.
- `aws_assume_role_arn_production`: The AWS role to assume for production.
- `aws_assume_role_external_id_production`: The external ID for the AWS role for production.

[Drone]: https://drone.meltwater.io/

### Publishing

Use the [`npm version`][npm-version] command to release a new version.
This will push a new git tag which will trigger a CI publish job.

[npm-version]: https://docs.npmjs.com/cli/version

## Contributing

Please submit and comment on bug reports and feature requests.

To submit a patch:

1. Fork it (https://github.com/meltwater/jackalambda/fork).
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Make changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin my-new-feature`).
6. Create a new Pull Request.

## License

This Serverless project is Copyright (c) 2019-2020 Meltwater Group.

## Warranty

This software is provided by the copyright holders and contributors "as is" and
any express or implied warranties, including, but not limited to, the implied
warranties of merchantability and fitness for a particular purpose are
disclaimed. In no event shall the copyright holder or contributors be liable for
any direct, indirect, incidental, special, exemplary, or consequential damages
(including, but not limited to, procurement of substitute goods or services;
loss of use, data, or profits; or business interruption) however caused and on
any theory of liability, whether in contract, strict liability, or tort
(including negligence or otherwise) arising in any way out of the use of this
software, even if advised of the possibility of such damage.
