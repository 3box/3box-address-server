const AWS = require("aws-sdk");
const ipfs = require("ipfs-js");

class IpfsMgr {
  constructor(endpoint) {
    this.ipfsEndpoint = endpoint;
  }

  isSecretsSet() {
    return true;
  }

  async getHash(identity) {
    //TODO: get the ipfs hash associated with the identity
  }
}

module.exports = IpfsMgr;
