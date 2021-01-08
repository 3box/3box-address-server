class LinkMgr {
  constructor() {
    this.pgUrl = null;
    this.client = null;
  }

  isSecretsSet() {
    return this.pgUrl != null;
  }

  setSecrets(secrets) {
    this.pgUrl = secrets.PG_URL;
  }

  setClient(client) {
    this.client = client
  }

  async store(address, did, consent, type, chainId, contractAddress, timestamp) {
    if (!address) throw new Error("no address");
    if (!did) throw new Error("no did");
    if (!consent) throw new Error("no consent");
    if (!this.pgUrl) throw new Error("no pgUrl set");
    if (!this.client) throw new Error('no client set')

    try {
      const res = await this.client.query(
        `INSERT INTO links(address, did, consent, type, chainId, contractAddress, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (address) DO UPDATE SET did = EXCLUDED.did, consent = EXCLUDED.consent`,
        [address, did, consent, type, chainId, contractAddress, timestamp]
      );
      return res;
    } catch (e) {
      throw e;
    }
  }

  async get(address) {
    if (!address) throw new Error("no address");
    if (!this.pgUrl) throw new Error("no pgUrl set");
    if (!this.client) throw new Error('no client set')

    try {
      const res = await this.client.query(
        `SELECT did FROM links WHERE address = $1`,
        [address]
      );
      return res.rows[0];
    } catch (e) {
      throw e;
    }
  }

  async getMultiple(addresses) {
    if (!addresses || !addresses.length) throw new Error("no addresses");
    if (!this.pgUrl) throw new Error("no pgUrl set");
    if (!this.client) throw new Error('no client set')

    try {
      const res = await this.client.query(
        `SELECT address, did FROM links WHERE address = ANY ($1)`,
        [addresses]
      );
      return res.rows
    } catch (e) {
      throw e;
    }
  }

  async remove(address) {
    if (!address) throw new Error("no address");
    if (!this.pgUrl) throw new Error("no pgUrl set");
    if (!this.client) throw new Error('no client set')

    try {
      const res = await this.client.query(
        `DELETE FROM links WHERE address = $1`,
        [address]
      );
      return res;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = LinkMgr;
