class LinkDeleteHandler {
  constructor(uPortMgr, linkMgr) {
    this.uPortMgr = uPortMgr
    this.linkMgr = linkMgr
  }

  async handle(event, context, cb) {
    // Parse body
    let body
    try {
      body = JSON.parse(event.body)
    } catch (e) {
      cb({ code: 403, message: 'no json body: ' + e.toString() })
      return
    }

    // Check if address_token is present
    if (!body.delete_token) {
      cb({ code: 401, message: 'Invalid JWT' })
      return
    }

    // Check that sig is valid, all set for 1hr valid, checks if expired
    let payload
    try {
      let token = await this.uPortMgr.verifyToken(body.delete_token)
      payload = token.payload
    } catch (error) {
      console.log('Error on this.uportMgr.verifyToken')
      console.log(error)
      cb({ code: 401, message: 'Invalid JWT' })
      return
    }

    const address = payload.address
    const typeValid = payload.type === `delete-address-link`

    if (!typeValid) {
      cb({ code: 400, message: 'token message invalid' })
      return
    }

    // check that addres -> did link in jwt is same as link in store already
    const link = await this.linkMgr.get(address)

    if (!link.did === payload.iss) {
      cb({ code: 400, message: 'attempting to delete link not created by same DID' })
      return
    }

    await this.linkMgr.remove(address)

    cb(null, address)
  }
}
module.exports = LinkDeleteHandler
