class LinkPostHandler {
  constructor() {}

  async handle(event, context, cb) {
    //Parse body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      cb({ code: 403, message: "no json body: " + e.toString() });
      return;
    }

    // Check if hash_token is present
    if (!body.consent_signature || !body.linked_did) {
      cb({ code: 403, message: "Missing data" });
      return;
    }

    await this.storageMgr.storeHash(body.consent_signature, body.linked_did);

    cb(null);
    return;
  }
}
module.exports = LinkPostHandler;
