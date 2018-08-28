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
    if (!identity) throw new Error("no identity");
    return true;
  }
}

module.exports = IpfsMgr;
