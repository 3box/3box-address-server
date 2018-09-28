'use strict'

const AWS = require('aws-sdk')

const AddressMgr = require('./lib/addressMgr')
const LinkMgr = require('./lib/linkMgr')
const UportMgr = require('./lib/uPortMgr')
const SigMgr = require('./lib/sigMgr')

const RootStoreAddressPostHanlder = require('./api/root_store_address_post')
const RootStoreAddressGetHanlder = require('./api/root_store_address_get')
const LinkPostHandler = require('./api/link_post')

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

const preHandler = (handler, event, context, callback) => {
  // console.log(event)
  if (!addressMgr.isSecretsSet() || !linkMgr.isSecretsSet()) {
    const kms = new AWS.KMS()
    kms
      .decrypt({ CiphertextBlob: Buffer(process.env.SECRETS, 'base64') })
      .promise()
      .then(data => {
        const decrypted = String(data.Plaintext)
        addressMgr.setSecrets(JSON.parse(decrypted))
        linkMgr.setSecrets(JSON.parse(decrypted))
        doHandler(handler, event, context, callback)
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

let linkPostHandler = new LinkPostHandler(sigMgr, linkMgr)
module.exports.link_post = (event, context, callback) => {
  preHandler(linkPostHandler, event, context, callback)
}
