"use strict";

const AWS = require("aws-sdk");

const StorageMgr = require("./lib/storageMgr");
const UportMgr = require("./lib/uPortMgr");

const HashPostHandler = require("./api/hash_post");
const HashGetHandler = require("./api/hash_get");
const LinkPostHandler = require("./api/link_post");

let uPortMgr = new UportMgr();
let storageMgr = new StorageMgr();

const doHandler = (handler, event, context, callback) => {
  handler.handle(event, context, (err, resp) => {
    let response;
    if (err == null) {
      response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Headers": "snaphuntjwttoken",
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
        },
        body: JSON.stringify({
          status: "success",
          data: resp
        })
      };
    } else {
      let code = 500;
      if (err.code) code = err.code;
      let message = err;
      if (err.message) message = err.message;

      response = {
        statusCode: code,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Headers": "snaphuntjwttoken",
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
        },
        body: JSON.stringify({
          status: "error",
          message: message
        })
      };
    }

    callback(null, response);
  });
};

const preHandler = (handler, event, context, callback) => {
  //console.log(event)
  if (!storageMgr.isSecretsSet()) {
    const kms = new AWS.KMS();
    kms
      .decrypt({ CiphertextBlob: Buffer(process.env.SECRETS, "base64") })
      .promise()
      .then(data => {
        const decrypted = String(data.Plaintext);
        storageMgr.setSecrets(JSON.parse(decrypted));
        doHandler(handler, event, context, callback);
      });
  } else {
    doHandler(handler, event, context, callback);
  }
};

let hashPostHandler = new HashPostHandler(uPortMgr, storageMgr);
module.exports.hash_post = (event, context, callback) => {
  preHandler(hashPostHandler, event, context, callback);
};

let hashGetHandler = new HashGetHandler(storageMgr);
module.exports.hash_get = (event, context, callback) => {
  preHandler(hashGetHandler, event, context, callback);
};

let linkPostHandler = new LinkPostHandler(storageMgr);
module.exports.link_post = (event, context, callback) => {
  preHandler(linkPostHandler, event, context, callback);
};