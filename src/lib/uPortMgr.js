import { verifyJWT, decodeJWT } from "did-jwt";

const muportOpts = { ipfsConf: { protocol: 'https', host: 'ipfs.3box.io'}}

require("uport-did-resolver")();
require("ethr-did-resolver")();
require("muport-did-resolver")(muportOpts);

class UportMgr {
  async verifyToken(token) {
    if (!token) throw new Error("no token");
    return verifyJWT(token);
  }

  parseToken(jwt) {
    return decodeJWT(jwt)
  }
}

module.exports = UportMgr;
