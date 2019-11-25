const UportMgr = require("../uPortMgr");

jest.mock('ipfs-s3-dag-get', () => ({
  initIPFS: async () => {
    const doc = { id: 'did:3:GENESIS', '@context': 'https://w3id.org/did/v1', publicKey: [ { id: 'did:3:GENESIS#signingKey', type: 'Secp256k1VerificationKey2018', publicKeyHex: '04113970c9f2818bf183ee0cce54446fce4f6e1303d5b0d380ec95b5cf97e2f866403a204a0fda234f132a437ee0c56bd2a44dff661d8546dcb4132930ed36907a' }, { id: 'did:3:GENESIS#encryptionKey', type: 'Curve25519EncryptionPublicKey', publicKeyBase64: 'somakoiV8ZenByzOhk2Z6jxM2WCHtPB6KoPKj26YMFM=' }, { id: 'did:3:GENESIS#managementKey', type: 'Secp256k1VerificationKey2018', ethereumAddress: '0x456bf7002f2377798ef546fb7a0D0eE6155E02e5' } ], authentication: [ { type: 'Secp256k1SignatureAuthentication2018', publicKey: 'did:3:GENESIS#signingKey' } ] }
    return {
      dag: {
        get: async () => ({ value: doc })
      }
    }
  }
}))

describe("UportMgr", () => {
  let sut;
  let jwts = {
    legacy:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiIyb3pzRlFXQVU3Q3BIWkxxdTJ3U1liSkZXekROQjI2YW9DRiIsImlhdCI6MTUxMzM1MjgzNCwiZXZlbnQiOnsidHlwZSI6IlNUT1JFX0NPTk5FQ1RJT04iLCJhZGRyZXNzIjoiMm96c0ZRV0FVN0NwSFpMcXUyd1NZYkpGV3pETkIyNmFvQ0YiLCJjb25uZWN0aW9uVHlwZSI6ImNvbnRyYWN0cyIsImNvbm5lY3Rpb24iOiIweDJjYzMxOTEyYjJiMGYzMDc1YTg3YjM2NDA5MjNkNDVhMjZjZWYzZWUifSwiZXhwIjoxNTEzNDM5MjM0fQ.tqX5eEuaTEyYPUSgatK5zEsj_WpE-dIEHDc4ItpOvAZuBkSyV9_zbb0puNtDrZTVA7MlZ43FSSpf9CGIUxup-w"
  };
  const threeIdJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1NzQ2NzIyNTQsInJvb3RTdG9yZUFkZHJlc3MiOiIvb3JiaXRkYi9RbVNQS2lGaWQxdGRKWlhKcEptY2RNYm9ZakhiaDM0VGM5cTM4VTJvNlc4Z0VDLzEyMjBkNjE2NjljNzU5MGQ1MjI2NDU1MjIzNGMwOWM3ZmRmZTM3MTlmNDg3NjhkMGU0ZmNiNzA2YmJhYTg4YzQ4OGI0LnJvb3QiLCJpc3MiOiJkaWQ6MzpiYWZ5cmVpZmhwbXB3cHdtamhkNjR2Y3NjMzVmc2dqZ3BkcnFxZG5zeWp2NDVnZ2J6bjNsNW00ZmVkYSJ9.PG4U6Awwu-VCMDS12hnGeJ1Zop2cyL-LbXJnZGVgYsxZzTCmfrz-uNlMbRZ2r0al4WQg-dMGN6FgSNWmqEIPMQ'
  beforeAll(async () => {
    sut = new UportMgr();
    await sut.setSecrets({ IPFS_PATH: '', AWS_BUCKET_NAME: '' })
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("verifyToken() no token", done => {
    sut
      .verifyToken(null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no token");
        done();
      });
  });

  it('should verify 3id JWT correctly', async () => {
    expect(await sut.verifyToken(threeIdJWT)).toMatchSnapshot()
  })
});
