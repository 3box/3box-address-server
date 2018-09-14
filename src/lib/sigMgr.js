import sigUtil from 'eth-sig-util'

class SigMgr {
  async verify (msg, personalSig) {
    if (!msg) throw new Error('no msg')
    if (!personalSig) throw new Error('no personalSig')

    const msgParams = {
      data: msg,
      sig: personalSig
    }
    const recovered = sigUtil.recoverPersonalSignature(msgParams)
    return recovered
  }
}

module.exports = SigMgr
