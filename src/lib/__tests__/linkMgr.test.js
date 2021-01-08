jest.mock("pg");
import { Client } from "pg";
let pgClientMock = {
  connect: jest.fn(),
  end: jest.fn()
};
Client.mockImplementation(() => {
  return pgClientMock;
});
const LinkMgr = require("../linkMgr");

describe("LinkMgr", () => {
  let sut;
  let address = "0xbf7571b900839fa871e6f6efbbfd238eaa502735";
  let did = "did:muport:QmRhjfL4HLdB8LovGf1o43NJ8QnbfqmpdnTuBvZTewnuBV";
  let consent = '0xc0e8fb9dea14122d68fd32489a49e063a58553dc6f37038f49671276177507f93096c14ea6f20b40f309add9459f49f1d06afa5331d06d75f90fb1163bf41d341c';

  beforeEach(() => {
    sut = new LinkMgr();
  });

  test("is isSecretsSet", () => {
    let secretSet = sut.isSecretsSet();
    expect(secretSet).toEqual(false);
  });

  test("get() no pgUrl set", done => {
    sut
      .get(did)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no pgUrl set");
        done();
      });
  });

  test('store() no pgUrl set', done => {
    sut
      .store(address,did,consent)
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('no pgUrl set')
        done()
      })
  })


  test("setSecrets", () => {
    expect(sut.isSecretsSet()).toEqual(false);
    sut.setSecrets({ PG_URL: "fake" });
    expect(sut.isSecretsSet()).toEqual(true);
    expect(sut.pgUrl).not.toBeUndefined();
  });

  test("get() no address", done => {
    sut
      .get()
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no address");
        done();
      });
  });

  test.skip('get() fail pg', done => {
    sut.setSecrets({ PG_URL: 'fake' })
    pgClientMock.connect = jest.fn( () =>{
      throw new Error("pg failed");
    })
    sut
      .get(address)
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('pg failed')
        done()
      })
  })

  test("get() address", done => {
    sut.setSecrets({ PG_URL: "fake" });
    sut.setClient(pgClientMock)

    pgClientMock.connect = jest.fn();
    pgClientMock.connect.mockClear();
    pgClientMock.end.mockClear();
    pgClientMock.query = jest.fn(() => {
      return Promise.resolve({ rows: [did] });
    });

    sut.get(address).then(resp => {
      //expect(pgClientMock.connect).toBeCalled();
      expect(pgClientMock.query).toBeCalled();
      expect(pgClientMock.query).toBeCalledWith(
        `SELECT did FROM links WHERE address = $1`,
        [address]
      );
      //expect(pgClientMock.end).toBeCalled();
      expect(resp).toEqual(did);

      done();
    });
  });

  test("store() no address", done => {
    sut
      .store()
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no address");
        done();
      });
  });

  test("store() no did", done => {
    sut
      .store(address)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no did");
        done();
      });
  });

  test("store() no consent", done => {
    sut
      .store(address,did)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no consent");
        done();
      });
  });

  test.skip('store() fail pg', done => {
    sut.setSecrets({ PG_URL: 'fake' })
    pgClientMock.connect = jest.fn( () =>{
      throw new Error("pg failed");
    })
    sut
    sut.store(address, did, consent)
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('pg failed')
        done()
      })
  })


  test("store() happy path", done => {
    sut.setSecrets({ PG_URL: "fake" });
    sut.setClient(pgClientMock)

    pgClientMock.connect = jest.fn();
    pgClientMock.connect.mockClear();
    pgClientMock.end.mockClear();
    pgClientMock.query = jest.fn(() => {
      return Promise.resolve(true);
    });

    sut.store(address, did, consent).then(resp => {
      //expect(pgClientMock.connect).toBeCalled();
      expect(pgClientMock.query).toBeCalled();
      expect(pgClientMock.query).toBeCalledWith(
        `INSERT INTO links(address, did, consent, type, chainId, contractAddress, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (address) DO UPDATE SET did = EXCLUDED.did, consent = EXCLUDED.consent`,
        [address, did, consent, undefined, undefined, undefined, undefined]
      );
      //expect(pgClientMock.end).toBeCalled();
      expect(resp).toBeTruthy();
      done();
    });
  });
});
