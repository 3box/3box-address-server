import { Client } from "pg";

class LinkMgr {
  constructor() {
    this.pgUrl = null;
  }

  isSecretsSet() {
    return this.pgUrl !== null;
  }

  setSecrets(secrets) {
    this.pgUrl = secrets.PG_URL;
  }

  async store(address, did, consent) {
    if (!address) throw new Error("no address");
    if (!did) throw new Error("no did");
    if (!consent) throw new Error("no consent");
    if (!this.pgUrl) throw new Error("no pgUrl set");

    const client = new Client({ connectionString: this.pgUrl });
    try {
      await client.connect();
      const res = await client.query(
        `INSERT INTO links(address, did, consent) VALUES ($1, $2, $3) ON CONFLICT (address) DO UPDATE SET did = EXCLUDED.did, consent = EXCLUDED.consent`,
        [address, did, consent]
      );
      return res;
    } catch (e) {
      throw e;
    } finally {
      await client.end();
    }
  }

  async get(address) {
    if (!address) throw new Error("no address");
    if (!this.pgUrl) throw new Error("no pgUrl set");

    const client = new Client({ connectionString: this.pgUrl });

    try {
      await client.connect();
      const res = await client.query(
        `SELECT did FROM links WHERE address = $1`,
        [address]
      );
      return res.rows[0];
    } catch (e) {
      throw e;
    } finally {
      await client.end();
    }
  }

  async remove(address) {
    if (!address) throw new Error("no address");
    if (!this.pgUrl) throw new Error("no pgUrl set");

    const client = new Client({ connectionString: this.pgUrl });

    try {
      await client.connect();
      const res = await client.query(
        `DELETE FROM links WHERE address = $1`,
        [address]
      );
      return res;
    } catch (e) {
      throw e;
    } finally {
      await client.end();
    }
  }
}

module.exports = LinkMgr;
