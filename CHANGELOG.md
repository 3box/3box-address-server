## v1.4.0 - 2020-07-09
* feat: upgrade s3 ipfs repo, shard blockstore support

## v1.3.0 - 2020-05-01
* chore: upgrade did-resolver and did-jwt libraries

## v1.2.0 - 2020-03-12
* feat: add bunyan logger
* feat: add fetch mutliple links and root store address queries

## v1.1.6 - 2020-01-24
* fix: don't verify EOA type signature for erc1271 contracts

## v1.1.5 - 2020-01-15
* fix: let AWS S3 client load credentials from environment variables

## v1.1.4 - 2020-01-07
* feat: load secrets from env vars only (if valid)
* feat: add dockerfile for local development using serverless offline
* feat: allow S3 client options to be set for endpoint, addressing style and signature version

## v1.1.3 - 2019-12-16
* feat: configure separate dev and prod environments
* feat: add parameter validation for ethereum addresses
* feat: re-enable CI
* security: upgrade webpack to v4.41.3
