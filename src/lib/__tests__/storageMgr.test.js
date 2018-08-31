jest.mock("pg");
import { Client } from "pg";
let pgClientMock = {
  connect: jest.fn(),
  end: jest.fn()
};
Client.mockImplementation(() => {
  return pgClientMock;
});
const StorageMgr = require("../storageMgr");

describe("StorageMgr", () => {
  let sut;
  let ipfsHash = "QmWYpzX6hn2JghNVhSZGcMm9damru6xjwZYY9MpZYp3cqH";
  let did = "did:muport:QmRhjfL4HLdB8LovGf1o43NJ8QnbfqmpdnTuBvZTewnuBV";
  let ethereumAddr = "0x0";

  beforeEach(() => {
    sut = new StorageMgr();
  });

  test("is isSecretsSet", () => {
    let secretSet = sut.isSecretsSet();
    expect(secretSet).toEqual(false);
  });

  test("getHash() no pgUrl set", done => {
    sut
      .getHash(ethereumAddr)
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

  test("getHash() no hash", done => {
    sut
      .getHash()
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no identity");
        done();
      });
  });

  test("getHash() did", done => {
    sut.setSecrets({ PG_URL: "fake" });

    pgClientMock.connect = jest.fn();
    pgClientMock.connect.mockClear();
    pgClientMock.end.mockClear();
    pgClientMock.query = jest.fn(() => {
      return Promise.resolve({ rows: [ipfsHash] });
    });

    sut.getHash(did).then(resp => {
      expect(pgClientMock.connect).toBeCalled();
      expect(pgClientMock.query).toBeCalled();
      expect(pgClientMock.query).toBeCalledWith(
        `SELECT hash FROM registry WHERE identity = $1`,
        [did]
      );
      expect(pgClientMock.end).toBeCalled();
      expect(resp).toEqual(ipfsHash);

      done();
    });
  });

  test("storeHash() no hash", done => {
    sut
      .storeHash()
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no hash");
        done();
      });
  });

  test("storeHash() happy path", done => {
    sut.setSecrets({ PG_URL: "fake" });

    pgClientMock.connect = jest.fn();
    pgClientMock.connect.mockClear();
    pgClientMock.end.mockClear();
    pgClientMock.query = jest.fn(() => {
      return Promise.resolve(true);
    });

    sut.storeHash(ipfsHash).then(resp => {
      expect(pgClientMock.connect).toBeCalled();
      expect(pgClientMock.query).toBeCalled();
      expect(pgClientMock.query).toBeCalledWith(
        `INSERT INTO registry(hash) VALUES ($1)`,
        [ipfsHash]
      );
      expect(pgClientMock.end).toBeCalled();
      expect(resp).toBeTruthy();
      done();
    });
  });
});
