class LinkPostHandler {
  constructor(sigMgr,linkMgr) {
    this.sigMgr = sigMgr;
    this.linkMgr = linkMgr;
  }
  async handle(event, context, cb) {
    //Parse body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      cb({ code: 403, message: "no json body: " + e.toString() });
      return;
    }

    // Check if data is present
    if (!body.consent_signature) {
      cb({ code: 403, message: "no consent_signature" });
      return;
    }
    if (!body.consent_msg) {
      cb({ code: 403, message: "no consent_msg" });
      return;
    }
    if (!body.linked_did) {
      cb({ code: 403, message: "no linked_did" });
      return;
    }

    const sig = body.consent_signature;
    const msg = body.consent_msg;
    const did = body.linked_did;
    
    //Get address from sigsignature + msg
    const address='';

    await this.linkMgr.store(address, did, consent);

    cb(null);
    return;
  }
}
module.exports = LinkPostHandler;
