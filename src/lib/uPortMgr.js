import { verifyJWT } from "did-jwt";
import { initIPFS } from "ipfs-s3-dag-get"
const register3idResolver = require('3id-resolver')
const registerMuPortResolver = require("muport-did-resolver")

// Register resolvers
function register (ipfs) {
  register3idResolver(ipfs)
  registerMuPortResolver(ipfs)
}

class UportMgr {
  isSecretsSet() {
    return this.ipfs !== null;
  }

  async setSecrets(secrets) {
    const config = {
      ipfsPath: secrets.IPFS_PATH,
      bucket: secrets.AWS_BUCKET_NAME
    }
    this.ipfs = await initIPFS(config)
    register(this.ipfs)
  }

  async verifyToken(token) {
    if (!token) throw new Error("no token");
    return verifyJWT(token);
  }
}

module.exports = UportMgr;
