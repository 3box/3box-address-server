import { verifyJWT } from "did-jwt";
import { initIPFS } from "./ipfs-fs-to-s3-datastore.js"
const register3idResolver = require('3id-resolver')
const registerMuPortResolver = require("muport-did-resolver")
const registerUPortResolver = require("uport-did-resolver")

// Register resolvers
function register (ipfs) {
  registerUPortResolver()
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
      bucket: secrets.AWS_BUCKET_NAME,
      accessKeyId: secrets.AWS_ACCESS_KEY_ID,
      secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY
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
