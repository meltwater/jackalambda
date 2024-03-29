# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to
[Semantic Versioning](https://semver.org/).

## 1.13.0 / 2021-07-28

### Added

- New method `delete` to `DynamodbDocumentClient`.
- New methods `listObjectVersions`, `deleteObjects` to `S3Client`.

## 1.12.0 / 2021-06-30

### Added

- New method `query` to `DynamodbDocumentClient`.

## 1.11.1 / 2021-05-21

### Fixed

- `parseJsonHttpEvent` decode body if `isBase64Encoded`.

## 1.11.0 / 2021-05-07

### Added

- New methods `upload` and `getObject` to `S3Client`.

## 1.10.0 / 2021-04-22

### Added

- New `SnsClient`.

## 1.9.1 / 2021-03-29

### Fixed

- Syntax for `LOGGER_REDACTION_LISTS`.

## 1.9.0 / 2021-03-29

### Added

- New `LOGGER_REDACTION_LISTS`.

## 1.8.1 / 2021-03-09

### Fixed

- Bad parameter name in `EventbridgeClient`.

## 1.8.0 / 2021-03-08

### Added

- New `EventbridgeClient`.

## 1.7.0 / 2021-02-04

### Added

- New property `headers` to `HttpEvent`.
- New property `requestContext` to `HttpEvent`.
- New property `cookies` to `HttpEvent`.

## 1.6.0 / 2021-01-24

### Added

- New option `loggerOptions` to `createHandler`.

## 1.5.0 / 2021-01-25

### Added

- New method `update` to `DynamodbDocumentClient`.

## 1.4.0 / 2020-11-17

### Added

- New method `uploadJson` to `S3Client`.

## 1.3.0 / 2020-11-17

### Changed

- Release under the MIT license.

## 1.2.3 / 2020-11-03

### Fixed

- Always provide default status code.

## 1.2.2 / 2020-11-01

### Fixed

- DynamodbDocumentClient still not logging hashKey and rangeKey.

## 1.2.1 / 2020-10-30

### Fixed

- DynamodbDocumentClient not logging hashKey and rangeKey.

## 1.2.0 / 2020-10-30

### Changed

- Normalized all logging.

## 1.1.1 / 2020-10-30

### Fix

- DynamodbDocumentClient now passes table name from in constructor to client methods.

## 1.1.0 / 2020-10-29

### Added

- DynamodbDocumentClient

## 1.0.0

- Initial release.
