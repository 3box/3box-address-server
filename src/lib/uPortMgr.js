import { verifyJWT } from "did-jwt";

require("uport-did-resolver")();
require("ethr-did-resolver")();
require("muport-did-resolver")();

class UportMgr {
  async verifyToken(token) {
    if (!token) throw new Error("no token");
    return verifyJWT(token);
  }
}

module.exports = UportMgr;
