import { verifyJWT } from "did-jwt"
import { initIPFS } from "ipfs-s3-dag-get"
const { Resolver } = require('did-resolver')
const get3IdResolver = require('3id-resolver').getResolver
const getMuportResolver = require("muport-did-resolver").getResolver


class UportMgr {
  isSecretsSet() {
    return this.ipfs != null;
  }

  async setSecrets(secrets) {
    const config = {
      ipfsPath: secrets.IPFS_PATH,
      bucket: secrets.AWS_BUCKET_NAME,
      endpoint: secrets.AWS_S3_ENDPOINT,
      s3ForcePathStyle: secrets.AWS_S3_ADDRESSING_STYLE === 'path',
      signatureVersion: secrets.AWS_S3_SIGNATURE_VERSION,
    }
    this.ipfs = await initIPFS(config)
    this.resolver = new Resolver({
      ...get3IdResolver(this.ipfs),
      ...getMuportResolver(this.ipfs)
    })
  }

  async verifyToken(token) {
    if (!token) throw new Error("no token");
    return verifyJWT(token, { resolver: this.resolver });
  }
}

module.exports = UportMgr;
