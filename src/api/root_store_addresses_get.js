class RootStoreAddressesGetHandler {
  constructor(addressMgr, linkMgr) {
    this.addressMgr = addressMgr
    this.linkMgr = linkMgr
  }

  async handle(event, context, cb) {
    let body
    try {
      body = JSON.parse(event.body)
    } catch (e) {
      cb({ code: 403, message: 'no json body: ' + e.toString() })
      return
    }
    if (!body.identities || !Array.isArray(body.identities) || body.identities.length === 0) {
      cb({ code: 400, message: 'no identities in parameter' })
      return
    }

    let promises = []
    let resultObj = {}
    const getRootStoreFromId = async id => {
      const did = await this.getDID(id)
      if (!did) {
        resultObj[did] = await this.getRootStore(did)
      }
    }
    body.identities.forEach(id => {
      promises.push(getRootStoreFromId(id))
    })
    await Promise.await(promises)
    cb(null, { rootStoreAddresses: resultObj })
  }

  async getRootStore(did) {
    // Get rsAddress for did from db
    const rsAddress = await this.addressMgr.get(did)
    if (!rsAddress) {
      return null
    } else {
      return rsAddress.root_store_address
    }
  }

  async getDID(id) {
    // Check if id is an address or a did
    let did
    if (id.startsWith('0x')) {
      const didRow = await this.linkMgr.get(id)
      if (!didRow) {
        return null
      }
      did = didRow.did
    } else if (id.startsWith('did:')) {
      did = id
    } else {
      return null
    }
    return did
  }
}
module.exports = RootStoreAddressGetHandler
