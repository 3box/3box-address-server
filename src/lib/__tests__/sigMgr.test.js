const SigMgr = require("../sigMgr");

describe("SigMgr", () => {
    let sut;
    let msg='0x..'
    let personalSig='0xc0e8fb9dea14122d68fd32489a49e063a58553dc6f37038f49671276177507f93096c14ea6f20b40f309add9459f49f1d06afa5331d06d75f90fb1163bf41d341c'

  beforeAll(() => {
    sut = new SigMgr();
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("verify() no msg", done => {
    sut
      .verify(null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no msg");
        done();
      });
  });


  test("verify() no personalSig", done => {
    sut
      .verify(msg)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no personalSig");
        done();
      });
  });

 test("verify() happy path", done => {
    sut
    .verify(msg,personalSig)
    .then(resp => {
        expect(resp).toEqual("0x37f1480bd7061253ac168acc06532cb7f66bf60a"); //FIX: Ultra fake
        done();
    })
    .catch(err => {
        fail(err);
        done();
    });
 });
  

});
