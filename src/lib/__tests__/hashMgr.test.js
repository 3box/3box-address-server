jest.mock("pg");
import { Client } from "pg";
let pgClientMock = {
  connect: jest.fn(),
  end: jest.fn()
};
Client.mockImplementation(() => {
  return pgClientMock;
});
const HashMgr = require("../hashMgr");

describe("HashMgr", () => {
  let sut;
  let ipfsHash = "QmWYpzX6hn2JghNVhSZGcMm9damru6xjwZYY9MpZYp3cqH";
  let did = "did:muport:QmRhjfL4HLdB8LovGf1o43NJ8QnbfqmpdnTuBvZTewnuBV";

  beforeEach(() => {
    sut = new HashMgr();
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

  test("setSecrets", () => {
    expect(sut.isSecretsSet()).toEqual(false);
    sut.setSecrets({ PG_URL: "fake" });
    expect(sut.isSecretsSet()).toEqual(true);
    expect(sut.pgUrl).not.toBeUndefined();
  });

  test("get() no did", done => {
    sut
      .get()
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no did");
        done();
      });
  });

  test("get() did", done => {
    sut.setSecrets({ PG_URL: "fake" });

    pgClientMock.connect = jest.fn();
    pgClientMock.connect.mockClear();
    pgClientMock.end.mockClear();
    pgClientMock.query = jest.fn(() => {
      return Promise.resolve({ rows: [ipfsHash] });
    });

    sut.get(did).then(resp => {
      expect(pgClientMock.connect).toBeCalled();
      expect(pgClientMock.query).toBeCalled();
      expect(pgClientMock.query).toBeCalledWith(
        `SELECT hash FROM hashes WHERE did = $1`,
        [did]
      );
      expect(pgClientMock.end).toBeCalled();
      expect(resp).toEqual(ipfsHash);

      done();
    });
  });

  test("store() no hash", done => {
    sut
      .store()
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no hash");
        done();
      });
  });

  test("store() no did", done => {
    sut
      .store(ipfsHash)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no did");
        done();
      });
  });

  test("store() happy path", done => {
    sut.setSecrets({ PG_URL: "fake" });

    pgClientMock.connect = jest.fn();
    pgClientMock.connect.mockClear();
    pgClientMock.end.mockClear();
    pgClientMock.query = jest.fn(() => {
      return Promise.resolve(true);
    });

    sut.store(ipfsHash, did).then(resp => {
      expect(pgClientMock.connect).toBeCalled();
      expect(pgClientMock.query).toBeCalled();
      expect(pgClientMock.query).toBeCalledWith(
        `INSERT INTO hashes(hash, did) VALUES ($1, $2)`,
        [ipfsHash, did]
      );
      expect(pgClientMock.end).toBeCalled();
      expect(resp).toBeTruthy();
      done();
    });
  });
});
