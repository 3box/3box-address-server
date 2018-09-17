const SigMgr = require('../sigMgr')

describe('SigMgr', () => {
  let sut
  let msg =
    '0x4920636f6e73656e7420746f206c696e6b206d7920616464726573733a200a3078626637353731623930303833396661383731653666366566626266643233386561613530323733350a746f206d79207075626c69632070726f66696c650a0a446973636c61696d65723a207075626c69632064617461206973207075626c696320666f726576657220616e642063616e206e6f7420626520756e6173736f6369617465642066726f6d20746869732070726f66696c652e204576656e20696620757064617465732c20746865206f726967696e616c20656e74726965732077696c6c20706572736973742e'
  let personalSig =
    '0xc0e8fb9dea14122d68fd32489a49e063a58553dc6f37038f49671276177507f93096c14ea6f20b40f309add9459f49f1d06afa5331d06d75f90fb1163bf41d341c'
  let addr = '0xbf7571b900839fa871e6f6efbbfd238eaa502735'

  beforeAll(() => {
    sut = new SigMgr()
  })

  test('empty constructor', () => {
    expect(sut).not.toBeUndefined()
  })

  test('verify() no msg', done => {
    sut
      .verify(null)
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('no msg')
        done()
      })
  })

  test('verify() no personalSig', done => {
    sut
      .verify(msg)
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('no personalSig')
        done()
      })
  })

  test('verify() happy path', done => {
    sut
      .verify(msg, personalSig)
      .then(resp => {
        expect(resp).toEqual(addr)
        done()
      })
      .catch(err => {
        fail(err)
        done()
      })
  })
})
