import { Client } from "pg";

class HashMgr {
  constructor() {
    this.pgUrl = null;
  }

  isSecretsSet() {
    return this.pgUrl !== null;
  }

  setSecrets(secrets) {
    this.pgUrl = secrets.PG_URL;
  }

  async store(hash, did) {
    if (!hash) throw new Error("no hash");
    if (!did) throw new Error("no did");
    if (!this.pgUrl) throw new Error("no pgUrl set");

    const client = new Client({ connectionString: this.pgUrl });
    try {
      await client.connect();
      const res = await client.query(
        `INSERT INTO hashes(hash, did) VALUES ($1, $2)`,
        [hash, did]
      );
      return res;
    } catch (e) {
      throw e;
    } finally {
      await client.end();
    }
  }

  async get(did) {
    if (!did) throw new Error("no did");
    if (!this.pgUrl) throw new Error("no pgUrl set");

    const client = new Client({ connectionString: this.pgUrl });

    try {
      await client.connect();
      const res = await client.query(
        `SELECT hash FROM hashes WHERE did = $1`,
        [did]
      );
      return res.rows[0];
    } catch (e) {
      throw e;
    } finally {
      await client.end();
    }
  }
}

module.exports = HashMgr;
