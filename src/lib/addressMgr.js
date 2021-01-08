class AddressMgr {
  constructor () {
    this.pgUrl = null
    this.client = null
  }

  isSecretsSet () {
    return this.pgUrl != null
  }

  setSecrets (secrets) {
    this.pgUrl = secrets.PG_URL
  }

  setClient(client) {
    this.client = client
  }

  async store (rsAddress, did) {
    if (!rsAddress) throw new Error('no root store address')
    if (!did) throw new Error('no did')
    if (!this.pgUrl) throw new Error('no pgUrl set')
    if (!this.client) throw new Error('no client set')

    try {
      const res = await this.client.query(
        `INSERT INTO root_store_addresses(root_store_address, did) VALUES ($1, $2) ON CONFLICT (did) DO UPDATE SET root_store_address = EXCLUDED.root_store_address`,
        [rsAddress, did]
      )
      return res
    } catch (e) {
      throw e
    }
  }

  async get (did) {
    if (!did) throw new Error('no did')
    if (!this.pgUrl) throw new Error('no pgUrl set')
    if (!this.client) throw new Error('no client set')

    try {
      const res = await this.client.query(
        `SELECT root_store_address FROM root_store_addresses WHERE did = $1`,
        [did]
      )
      return res.rows[0]
    } catch (e) {
      throw e
    }
  }

  async getMultiple(dids) {
    if (!dids || !dids.length) throw new Error('no dids')
    if (!this.pgUrl) throw new Error('no pgUrl set')
    if (!this.client) throw new Error('no client set')

    try {
      const res = await this.client.query(
        `SELECT did, root_store_address FROM root_store_addresses WHERE did = ANY ($1)`,
        [dids]
      )
      return res.rows
    } catch (e) {
      throw e
    }
  }
}

module.exports = AddressMgr
