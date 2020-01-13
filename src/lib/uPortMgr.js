import { verifyJWT } from "did-jwt"
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
    return this.ipfs != null;
  }

  async setSecrets(secrets) {
    const config = {
      ipfsPath: secrets.IPFS_PATH,
      bucket: secrets.AWS_BUCKET_NAME,
      accessKeyId: secrets.AWS_ACCESS_KEY_ID,
      secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY,
      endpoint: secrets.AWS_S3_ENDPOINT,
      s3ForcePathStyle: secrets.AWS_S3_ADDRESSING_STYLE === 'path',
      signatureVersion: secrets.AWS_S3_SIGNATURE_VERSION,
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
