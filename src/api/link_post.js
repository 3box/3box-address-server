const isIPFS = require('is-ipfs')

// valid 3 DID or muport DID
const isValidDID = did => {
  const parts = did.split(':')
  if (!parts[0] === 'did' || !(parts[1] === '3' || parts[1] === 'muport')) return false
  return isIPFS.cid(parts[2])
}

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

    const handlers = {
      '0':  this.v0Handler,
      '1':  this.v1Handler,
    }

    const version = body.version || 0

    if (!Object.keys(handlers).includes(version.toString())) {
      cb({ code: 403, message: 'invalid link proof version' })
      return
    }

    let {msg, sig, did } = await handlers[version](body, cb)

    // Get address from sigsignature + msg
    const address = await this.sigMgr.verify(msg, sig)
    const consent = JSON.stringify({ msg, sig })

    await this.linkMgr.store(address, did, consent)

    cb(null, { did: did, address: address })
  }

  async v0Handler(body, cb) {
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

    return {msg, sig, did}
  }

  async v1Handler(body, cb) {
    // Check if data is present
    if (!body.signature) {
      cb({ code: 403, message: 'no signature' })
      return
    }
    if (!body.message) {
      cb({ code: 403, message: 'no message' })
      return
    }

    const sig = body.signature
    const msg = body.message

    const regex = /(did:\S+)/

    const didMatch = regex.exec(msg)
    if (!didMatch || !isValidDID(didMatch[0])) {
      cb({ code: 400, message: 'no valid did in the consent_msg' })
      return
    }

    const did = didMatch[0]

    return {msg, sig, did}
  }
}
module.exports = LinkPostHandler
