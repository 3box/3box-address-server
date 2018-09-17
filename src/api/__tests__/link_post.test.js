const LinkPostHandler = require('../link_post')

describe('LinkPostHandler', () => {
  let sut

  beforeAll(() => {
    sut = new LinkPostHandler()
  })

  test('empty constructor', () => {
    expect(sut).not.toBeUndefined()
  })

  test('handle null body', done => {
    sut.handle({}, {}, (err, res) => {
      expect(err).not.toBeNull()
      expect(err.code).toEqual(403)
      expect(err.message).toBeDefined()
      done()
    })
  })

  test('no consent_signature', done => {
    sut.handle({ body: '{}' }, {}, (err, res) => {
      expect(err).not.toBeNull()
      expect(err.code).toEqual(403)
      expect(err.message).toEqual('no consent_signature')
      done()
    })
  })

  test('no consent_msg', done => {
    sut.handle(
      { body: JSON.stringify({ consent_signature: 'somesignature' }) },
      {},
      (err, res) => {
        expect(err).not.toBeNull()
        expect(err.code).toEqual(403)
        expect(err.message).toEqual('no consent_msg')
        done()
      }
    )
  })

  test('no linked_did', done => {
    sut.handle(
      {
        body: JSON.stringify({
          consent_signature: 'somesignature',
          consent_msg: 'hello world'
        })
      },
      {},
      (err, res) => {
        expect(err).not.toBeNull()
        expect(err.code).toEqual(403)
        expect(err.message).toEqual('no linked_did')
        done()
      }
    )
  })

  test('no did present on the message', done => {
    sut.handle(
      {
        body: JSON.stringify({
          consent_signature: 'somesignature',
          consent_msg: 'hello world',
          linked_did: 'did:muport:fake'
        })
      },
      {},
      (err, res) => {
        expect(err).not.toBeNull()
        expect(err.code).toEqual(400)
        expect(err.message).toEqual('no did on the consent_msg')
        done()
      }
    )
  })

  test('linked_did does not match with message did', done => {
    sut.handle(
      {
        body: JSON.stringify({
          consent_signature: 'somesignature',
          consent_msg: 'Create a new 3Box profile' +
            '\n\n' +
            '- \n' +
            'Your unique profile ID is did:muport:other',
          linked_did: 'did:muport:fake'
        })
      },
      {},
      (err, res) => {
        expect(err).not.toBeNull()
        expect(err.code).toEqual(400)
        expect(err.message).toEqual('dids does not match')
        done()
      }
    )
  })
})
