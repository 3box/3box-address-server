class HashGetHandler {
  constructor(storageMgr) {
    this.storageMgr = storageMgr;
  }

  async handle(event, context, cb) {
    if (event.pathParameters && event.pathParameters.id) {
      let id = event.pathParameters.id;
      if (!this.storageMgr.getHash(identity)) {
        cb({ code: 404, message: "Hash not found" });
      } else {
        cb(null, { hash: this.storageMgr.getHash(id) });
      }
    } else {
      cb({ code: 400, mesasge: "No id parameter" });
    }
  }
}
module.exports = HashGetHandler;
