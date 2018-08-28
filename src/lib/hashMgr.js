class HashMgr {
  async storeHash(hash) {
    //TODO: store the hash in an off-chain registry
    if (!hash) throw new Error("no hash");

    return true;
  }
}

module.exports = HashMgr;
