class RootStoreAddressGetHandler {
  constructor (addressMgr, linkMgr) {
    this.addressMgr = addressMgr
    this.linkMgr = linkMgr
  }

  async handle (event, context, cb) {
    if (!event.pathParameters || !event.pathParameters.id) {
      cb({ code: 400, message: 'no id parameter' })
      return
    }

    const id = event.pathParameters.id
    // Check if id is an address or a did
    let did
    if (id.startsWith('0x')) {
      const didRow = await this.linkMgr.get(id)
      if (!didRow) {
        cb({ code: 404, message: 'address not linked' })
        return
      }
      did = didRow.did
    } else if (id.startsWith('did:')) {
      did = id
    } else {
      cb({ code: 401, message: 'invalid id' })
      return
    }

    // Get rsAddress for did from db
    const rsAddress = await this.addresMgr.get(did)
    if (!rsAddress) {
      cb({ code: 404, message: 'root store address not found' })
    } else {
      cb(null, { rootStoreAddress: rsAddress.rootStoreAddress })
    }
  }
}
module.exports = RootStoreAddressGetHandler
