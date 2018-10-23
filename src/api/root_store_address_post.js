class RootStoreAddressPost {
  constructor (uPortMgr, addressMgr) {
    this.uPortMgr = uPortMgr
    this.addressMgr = addressMgr
  }

  async handle (event, context, cb) {
    // Parse body
    let body
    try {
      body = JSON.parse(event.body)
    } catch (e) {
      cb({ code: 403, message: 'no json body: ' + e.toString() })
      return
    }

    // Check if address_token is present
    if (!body.address_token) {
      cb({ code: 401, message: 'Invalid JWT' })
      return
    }

    const payload = this.uPortMgr.parseToken(body.address_token).payload

    // Check if root store address is present
    if (!payload.rootStoreAddress) {
      cb({ code: 403, message: 'Missing data' })
      return
    }

    // Get rsAddress for did from db
    const rsAddress = await this.addressMgr.get(payload.iss)
    if (rsAddress) {
      cb(null, payload.rootStoreAddress)
      return
    }

    try {
      await this.uPortMgr.verifyToken(body.address_token)
    } catch (error) {
      console.log('Error on this.uportMgr.verifyToken')
      console.log(error)
      cb({ code: 401, message: 'Invalid JWT' })
      return
    }

    await this.addressMgr.store(payload.rootStoreAddress, payload.iss)

    cb(null, payload.rootStoreAddress)
  }
}
module.exports = RootStoreAddressPost
