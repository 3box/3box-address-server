import { Client } from "pg";

class StorageMgr {
  constructor() {
    this.pgUrl = null;
  }

  isSecretsSet() {
    return this.pgUrl !== null;
  }

  setSecrets(secrets) {
    this.pgUrl = secrets.PG_URL;
  }

  async storeHash(hash) {
    if (!hash) throw new Error("no hash");
    if (!this.pgUrl) throw new Error("no pgUrl set");

    const client = new Client({ connectionString: this.pgUrl });
    try {
      await client.connect();
      const res = await client.query(`INSERT INTO registry(hash) VALUES ($1)`, [
        hash
      ]);
      return res;
    } catch (e) {
      throw e;
    } finally {
      await client.end();
    }
  }

  async getHash(identity) {
    if (!identity) throw new Error("no identity");
    if (!this.pgUrl) throw new Error("no pgUrl set");

    const client = new Client({ connectionString: this.pgUrl });

    try {
      await client.connect();
      const res = await client.query(
        `SELECT hash FROM registry WHERE identity = $1`,
        [identity]
      );
      return res.rows[0];
    } catch (e) {
      throw e;
    } finally {
      await client.end();
    }
  }

  async linkHashToIdentity(hash, identity) {
    if (!hash) throw new Error("no hash");
    if (!identity) throw new Error("no idenity");
    if (!this.pgUrl) throw new Error("no pgUrl set");

    const client = new Client({ connectionString: this.pgUrl });
    try {
      await client.connect();
      const res = await client.query(
        `UPDATE registry SET identity = $2 \
        WHERE hash = $1`,
        [hash, identity]
      );
      return res;
    } catch (e) {
      throw e;
    } finally {
      await client.end();
    }
  }
}

module.exports = StorageMgr;
