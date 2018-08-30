import { AWS } from "aws-sdk";

class StorageMgr {
  constructor() {}

  isSecretsSet() {
    return true;
  }

  async storeHash(hash) {
    if (!hash) throw new Error("no hash");
    return true;
  }

  async getHash(identity) {
    //TODO: get the ipfs hash associated with the identity
    if (!identity) throw new Error("no identity");
    return true;
  }
}

module.exports = StorageMgr;
