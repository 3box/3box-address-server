const HashMgr = require("../hashMgr");

describe("HashMgr", () => {
  let sut;
  let ipfsHash = "QmWYpzX6hn2JghNVhSZGcMm9damru6xjwZYY9MpZYp3cqH";

  beforeEach(() => {
    sut = new HashMgr();
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
