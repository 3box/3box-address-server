const StorageMgr = require("../storageMgr");

describe("StorageMgr", () => {
  let sut;
  let ipfsHash = "QmWYpzX6hn2JghNVhSZGcMm9damru6xjwZYY9MpZYp3cqH";
  let did = "did:muport:QmRhjfL4HLdB8LovGf1o43NJ8QnbfqmpdnTuBvZTewnuBV";
  let ethereumAddr = "0x0";

  beforeEach(() => {
    sut = new StorageMgr();
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
    sut.getHash(did).then(resp => {
      expect(resp).toBeTruthy();
      done();
    });
  });

  test("getHash() ethereum address", done => {
    sut.getHash(ethereumAddr).then(resp => {
      expect(resp).toBeTruthy();
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
    sut.storeHash(ipfsHash).then(resp => {
      expect(resp).toBeTruthy();
      done();
    });
  });
});
