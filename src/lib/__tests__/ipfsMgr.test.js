const IpfsMgr = require("../ipfsMgr");

describe("HashMgr", () => {
  let sut;
  let did = "did:muport:QmRhjfL4HLdB8LovGf1o43NJ8QnbfqmpdnTuBvZTewnuBV";
  let ethereumAddr = "0x0";

  beforeEach(() => {
    sut = new IpfsMgr();
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
});
