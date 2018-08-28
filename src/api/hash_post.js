class HashPostHandler {
  constructor(uPortMgr, hashMgr) {
    this.uPortMgr = uPortMgr;
    this.hashMgr = hashMgr;
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

    // Check if hash_token is present
    if (!body.hash_token) {
      cb({ code: 401, message: "Invalid JWT" });
      return;
    }

    let payload;
    try {
      let dtoken = await this.uPortMgr.verifyToken(body.hash_token);
      payload = dtoken.payload;
    } catch (error) {
      console.log("Error on this.uportMgr.verifyToken");
      console.log(error);
      cb({ code: 401, message: "Invalid JWT" });
      return;
    }

    // Check if hash is present
    if (!payload.hash) {
      cb({ code: 403, message: "Missing data" });
      return;
    }

    await this.hashMgr.storeHash(payload.hash);

    cb(null, payload.hash);
    return;
  }
}
module.exports = HashPostHandler;
