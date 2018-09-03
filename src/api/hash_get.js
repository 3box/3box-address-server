class HashGetHandler {
  constructor(hashMgr,linkMgr) {
    this.hashMgr = hashMgr;
    this.linkMgr = linkMgr;
  }

  async handle(event, context, cb) {
    if (!event.pathParameters || !event.pathParameters.id) {
      cb({ code: 400, message: "no id parameter" });
      return;
    }

    const id = event.pathParameters.id;
    //Check if id is an address or a did
    let did;
    if (id.startsWith('0x')){
      const didRow=await this.linkMgr.get(id);
      if(!didRow){
        cb({ code: 404, message: "address not linked" });
        return;
      }
      did = didRow.did;
    }else if(id.startsWith('did:')){
      did=id;
    }else{
      cb({ code: 401, message: "invalid id" });
      return;
    }

    //Get hash for did from db
    const hash=await this.hashMgr.get(did);
    if (!hash) {
      cb({ code: 404, message: "hash not found" });
    } else {
      cb(null, { hash: hash.hash });
    }
  }

  }
module.exports = HashGetHandler;
