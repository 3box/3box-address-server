class HashGetHandler {
  constructor(storageMgr) {
    this.storageMgr = storageMgr;
  }

  async handle(event, context, cb) {
    if (event.pathParameters && event.pathParameters.identity) {
      let identity = event.pathParameters.identity;
      if (!this.storageMgr.getHash(identity)) {
        cb({ code: 404, message: "Identity not found" });
      } else {
        cb(null, { hash: this.storageMgr.getHash(identity) });
      }
    } else {
      cb({ code: 400, mesasge: "No identity parameter" });
    }
  }
}
module.exports = HashGetHandler;
