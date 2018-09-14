class LinkPostHandler {
  constructor (sigMgr, linkMgr) {
    this.sigMgr = sigMgr
    this.linkMgr = linkMgr
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

    // Check if data is present
    if (!body.consent_signature) {
      cb({ code: 403, message: 'no consent_signature' })
      return
    }
    if (!body.consent_msg) {
      cb({ code: 403, message: 'no consent_msg' })
      return
    }
    if (!body.linked_did) {
      cb({ code: 403, message: 'no linked_did' })
      return
    }

    const sig = body.consent_signature
    const msg = body.consent_msg
    const did = body.linked_did

    const regex = /Your unique profile ID is (.*)/

    let msg_did = regex.exec(msg)
    if (!msg_did) {
      cb({ code: 400, message: 'no did on the consent_msg' })
      return
    }

    if (msg_did[1] !== did) {
      cb({ code: 400, message: 'dids does not match' })
      return
    }

    // Get address from sigsignature + msg
    const address = await this.sigMgr.verify(msg, sig)
    const consent = {
      sig: sig,
      msg: msg
    }

    await this.linkMgr.store(address, did, JSON.stringify(consent))

    cb(null, { did: did, address: address })
  }
}
module.exports = LinkPostHandler
