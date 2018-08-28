"use strict";

const AWS = require("aws-sdk");

const IpfsMgr = require("./lib/ipfsMgr");

const HashPostHandler = require("./api/hash_post");
const HashGetHandler = require("./api/hash_get");
const LinkPostHandler = require("./api/link_post");

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
      //console.log(err);
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

let ipfsMgr = new IpfsMgr();
const preHandler = (handler, event, context, callback) => {
  //console.log(event)
  if (!ipfsMgr.isSecretsSet()) {
    const kms = new AWS.KMS();
    kms
      .decrypt({ CiphertextBlob: Buffer(process.env.SECRETS, "base64") })
      .promise()
      .then(data => {
        const decrypted = String(data.Plaintext);
        ipfsMgr.setSecrets(JSON.parse(decrypted));
        doHandler(handler, event, context, callback);
      });
  } else {
    doHandler(handler, event, context, callback);
  }
};

let hashPostHandler = new HashPostHandler();
module.exports.hash_post = (event, context, callback) => {
  preHandler(hashPostHandler, event, context, callback);
};

let hashGetHandler = new HashGetHandler(ipfsMgr);
module.exports.hash_get = (event, context, callback) => {
  preHandler(hashGetHandler, event, context, callback);
};

let linkPostHandler = new LinkPostHandler();
module.exports.link_post = (event, context, callback) => {
  preHandler(linkPostHandler, event, context, callback);
};
