'use strict'

const AWS = require('aws-sdk')

const AddressMgr = require('./lib/addressMgr')
const LinkMgr = require('./lib/linkMgr')
const UportMgr = require('./lib/uPortMgr')
const SigMgr = require('./lib/sigMgr')

const RootStoreAddressPostHanlder = require('./api/root_store_address_post')
const RootStoreAddressGetHanlder = require('./api/root_store_address_get')
const RootStoreAddressesPostHanlder = require('./api/root_store_addresses_post')
const LinkPostHandler = require('./api/link_post')
const LinkDeleteHandler = require('./api/link_delete')

let uPortMgr = new UportMgr()
let sigMgr = new SigMgr()
let addressMgr = new AddressMgr()
let linkMgr = new LinkMgr()

const doHandler = (handler, event, context, callback) => {
  handler.handle(event, context, (err, resp) => {
    let response
    if (err == null) {
      response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'snaphuntjwttoken',
          'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
        },
        body: JSON.stringify({
          status: 'success',
          data: resp
        })
      }
    } else {
      let code = 500
      if (err.code) code = err.code
      let message = err
      if (err.message) message = err.message

      response = {
        statusCode: code,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'snaphuntjwttoken',
          'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
        },
        body: JSON.stringify({
          status: 'error',
          message: message
        })
      }
    }

    callback(null, response)
  })
}

const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key]
    return acc
  }, {})
}

// Get config values from environment if set
const configKeys = [
  'PG_URL',
  'IPFS_PATH',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_BUCKET_NAME',
  'AWS_S3_ENDPOINT',
  'AWS_S3_ADDRESSING_STYLE',
  'AWS_S3_SIGNATURE_VERSION',
]
const envConfig = pick(process.env, configKeys)

const preHandler = (handler, event, context, callback) => {
  if (!addressMgr.isSecretsSet() || !linkMgr.isSecretsSet() || !uPortMgr.isSecretsSet()) {
    // Try setting from environment first
    addressMgr.setSecrets(envConfig)
    linkMgr.setSecrets(envConfig)
    uPortMgr.setSecrets(envConfig)
      .catch(e => {}) // ignore error since we are retrying below if needed
      .finally((res) => {
        if (addressMgr.isSecretsSet() && linkMgr.isSecretsSet() && uPortMgr.isSecretsSet()) {
          return doHandler(handler, event, context, callback)
        }
        // If secrets not set form environment, get values from KMS
        const kms = new AWS.KMS()
        return kms
          .decrypt({ CiphertextBlob: Buffer(process.env.SECRETS, 'base64') })
          .promise()
          .then(data => {
            const decrypted = String(data.Plaintext)
            const config = Object.assign(JSON.parse(decrypted), envConfig)
            addressMgr.setSecrets(config)
            linkMgr.setSecrets(config)
            return uPortMgr.setSecrets(config)
          }).then(res => {
            doHandler(handler, event, context, callback)
          })
      })
  } else {
    doHandler(handler, event, context, callback)
  }
}

let rsAddressPostHanlder = new RootStoreAddressPostHanlder(uPortMgr, addressMgr)
module.exports.root_store_address_post = (event, context, callback) => {
  preHandler(rsAddressPostHanlder, event, context, callback)
}

let rsAddressGetHanlder = new RootStoreAddressGetHanlder(addressMgr, linkMgr)
module.exports.root_store_address_get = (event, context, callback) => {
  preHandler(rsAddressGetHanlder, event, context, callback)
}

let rsAddressesPostHanlder = new RootStoreAddressesPostHanlder(addressMgr, linkMgr)
module.exports.root_store_addresses_post = (event, context, callback) => {
  preHandler(rsAddressesPostHanlder, event, context, callback)
}

let linkPostHandler = new LinkPostHandler(sigMgr, linkMgr)
module.exports.link_post = (event, context, callback) => {
  preHandler(linkPostHandler, event, context, callback)
}

let linkDeleteHandler = new LinkDeleteHandler(uPortMgr, linkMgr)
module.exports.link_delete = (event, context, callback) => {
  preHandler(linkDeleteHandler, event, context, callback)
}
