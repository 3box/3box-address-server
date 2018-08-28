class HashGetHandler {
  constructor(ipfsMgr) {
    this.ipfsMgr = ipfsMgr;
  }

  async handle(event, context, cb) {
    if (event.pathParameters && event.pathParameters.identity) {
      let identity = event.pathParameters.identity;
      if (!this.ipfsMgr.getHash(identity)) {
        cb({ code: 404, message: "Identity not found" });
      } else {
        cb(null, { hash: this.ipfsMgr.getHash(identity) });
      }
    } else {
      cb({ code: 400, mesasge: "No identity parameter" });
    }
  }
}
module.exports = HashGetHandler;
