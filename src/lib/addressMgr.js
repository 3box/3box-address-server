import { Client } from 'pg'

class AddressMgr {
  constructor () {
    this.pgUrl = null
  }

  isSecretsSet () {
    return this.pgUrl !== null
  }

  setSecrets (secrets) {
    this.pgUrl = secrets.PG_URL
  }

  async store (rsAddress, did) {
    if (!rsAddress) throw new Error('no root store address')
    if (!did) throw new Error('no did')
    if (!this.pgUrl) throw new Error('no pgUrl set')

    const client = new Client({ connectionString: this.pgUrl })
    try {
      await client.connect()
      const res = await client.query(
        `INSERT INTO root_store_addresses(root_store_address, did) VALUES ($1, $2) ON CONFLICT (did) DO UPDATE SET root_store_address = EXCLUDED.root_store_address`,
        [rsAddress, did]
      )
      return res
    } catch (e) {
      throw e
    } finally {
      await client.end()
    }
  }

  async get (did) {
    if (!did) throw new Error('no did')
    if (!this.pgUrl) throw new Error('no pgUrl set')

    const client = new Client({ connectionString: this.pgUrl })

    try {
      await client.connect()
      const res = await client.query(
        `SELECT root_store_address FROM root_store_addresses WHERE did = $1`,
        [did]
      )
      return res.rows[0]
    } catch (e) {
      throw e
    } finally {
      await client.end()
    }
  }
}

module.exports = AddressMgr
