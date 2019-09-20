const isIPFS = require('is-ipfs')
const ethers = require('ethers')

const ACCOUNT_TYPES = {
  ethereum: 'ethereum',
  ethereumEOA: 'ethereum-eoa',
  erc1271: 'erc1271'
}

const SUPPORTED_CHAINS = {
  1: 'homestead',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
  5: 'goerli'
}

const MAGIC_ERC1271_VALUE = '0x20c13b0b'

// valid 3 DID or muport DID
const isValidDID = did => {
  const parts = did.split(':')
  if (!parts[0] === 'did' || !(parts[1] === '3' || parts[1] === 'muport')) return false
  return isIPFS.cid(parts[2])
}

const isValidAccountType = type => {
  return Object.values(ACCOUNT_TYPES).includes(type)
}

const isSupportedChainId = chainId => {
  return chainId && !!SUPPORTED_CHAINS[chainId]
}

const isValidTimestamp = timestamp => {
  return parseInt(timestamp, 10) > 0 && parseInt(timestamp, 10) <= +new Date()
}

const isValidSignature = async (contractAddress, chainId, sig, msg) => {
  const abi = [
    'function isValidSignature(bytes _messageHash, bytes _signature) public view returns (bytes4 magicValue)'
  ]
  const network = SUPPORTED_CHAINS[chainId]
  const ethersProvider = ethers.getDefaultProvider(network)
  const contract = new ethers.Contract(contractAddress, abi, ethersProvider)
  const message = '0x' + Buffer.from(msg, 'utf8').toString('hex')
  const returnValue = await contract.isValidSignature(message, sig)

  return returnValue === MAGIC_ERC1271_VALUE
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

    let {
      msg,
      sig,
      did,
      type,
      chainId,
      contractAddress,
      timestamp,
    } = await handlers[version](body, cb)

    // Get address from signature + msg
    const address = await this.sigMgr.verify(msg, sig)
    const consent = JSON.stringify({ msg, sig })

    await this.linkMgr.store(address, did, consent, type, chainId, contractAddress, timestamp)

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

    return {
      msg,
      sig,
      did,
      type: ACCOUNT_TYPES.ethereumEOA,
      chainId: null,
      contractAddress: null,
      timestamp: null
    }
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
    const type = body.type
    const chainId = body.chainId
    const address = body.address
    const timestamp = body.timestamp

    const regex = /(did:\S+)/

    const didMatch = regex.exec(msg)
    if (!didMatch || !isValidDID(didMatch[0])) {
      cb({ code: 400, message: 'no valid did in the consent_msg' })
      return
    }
    const did = didMatch[0]

    if (!!chainId && !isSupportedChainId(chainId)) {
      cb({ code: 400, message: 'unsupported chainId provided' })
      return
    }

    if (!!type && !isValidAccountType(type)) {
      cb({ code: 400, message: 'unsupported type provided' })
      return
    }

    if (type === ACCOUNT_TYPES.erc1271 && !address) {
      cb({ code: 403, message: 'no address' })
      return
    }

    if (type === ACCOUNT_TYPES.erc1271 && !(await isValidSignature(address, chainId, sig, msg))) {
      cb({ code: 400, message: 'invalid signature provided' })
      return
    }

    if (!!timestamp && !isValidTimestamp(timestamp)) {
      cb({ code: 400, message: 'invalid timestamp provided' })
      return
    }

    return {
      msg,
      sig,
      did,
      type: type || ACCOUNT_TYPES.ethereumEOA,
      chainId: chainId || null,
      contractAddress: address || null,
      timestamp: timestamp || null
    }
  }
}
module.exports = LinkPostHandler
