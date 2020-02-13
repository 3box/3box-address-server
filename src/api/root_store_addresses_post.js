const { hexString } = require('../lib/validator')

class RootStoreAddressesPostHandler {
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

    const idDidMap = await this.getDIDs(body.identities)
    const didRootStoreMap = await this.getRootStores(Object.values(idDidMap))
    
    const rootStoreAddresses = Object.keys(idDidMap).reduce((acc, id) => {
      if (didRootStoreMap[idDidMap[id]]) {
        acc[id] = didRootStoreMap[idDidMap[id]]
      }
      return acc
    }, {})
    cb(null, { rootStoreAddresses })
  }

  async getRootStores(dids) {
    if (!dids || !dids.length) {
      return {}
    }
    // Get rsAddress for did from db
    const rsAddressRows = await this.addressMgr.getMultiple(dids)
    return rsAddressRows.reduce((acc, row) => {
      acc[row.did] = row.root_store_address
      return acc
    }, {})
  }

  async getDIDs(ids) {
    if (!ids || !ids.length) {
      return {}
    }
    const { dids, addresses } = ids.reduce((acc, id) => {
      if (id.startsWith('0x') && !hexString.validate(id).error) {
        acc.addresses.push(id)
      } else if (id.startsWith('did:')) {
        acc.dids.push(id)
      }
      return acc
    }, { dids: [], addresses: [] })
    const didRows = addresses.length == 0 ? [] : await this.linkMgr.getMultiple(addresses)
    
    const results = {}
    didRows.forEach(row => results[row.address] = row.did)
    dids.forEach(did => results[did] = did)
    return results
  }
}
module.exports = RootStoreAddressesPostHandler
