const RootStoreAddressPost = require('../root_store_address_post')
const UportMgr = require('../../lib/uPortMgr')
const MockDate = require('mockdate')

describe('RootStoreAddressPost', () => {
  let sut
  let uPortMgrMock = new UportMgr()
  let addressMgrMock = {
    store: jest.fn()
  }

  const validToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNDg1MzIxMTMzIiwicm9vdFN0b3JlQWRkcmVzcyI6Ii9vcmJpdGRiL1FtZDhUbVpyV0FTeXBFcDRFcjl0Z1dQNGtDTlFuVzRuY1Nudmp2eUhRM0VWU1UvZmlyc3QtZGF0YWJhc2UiLCJpc3MiOiJkaWQ6dXBvcnQ6Mm9zbmZKNFd5N0xCQW0yblBCWGlyZTFXZlFuNzVSclY2VHMifQ.teUclheFRoojKYNy4l7mbWF3PY1jAOpHj5hKdJHOfVxjTdr3wsd5-dPeCFIemtWxoLDhd7NAdKxk-GLR7xscIQ'
  const invalidAudToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNDg1MzIxMTMzIiwicm9vdFN0b3JlQWRkcmVzcyI6Ii9vcmJpdGRiL1FtZDhUbVpyV0FTeXBFcDRFcjl0Z1dQNGtDTlFuVzRuY1Nudmp2eUhRM0VWU1UvZmlyc3QtZGF0YWJhc2UiLCJhdWQiOiJkaWQ6dXBvcnQ6Mm9zbmZKNFd5N0xCQW0yblBCWGlyZTFXZlFuNzVSclY2VHMiLCJpc3MiOiJkaWQ6dXBvcnQ6Mm9zbmZKNFd5N0xCQW0yblBCWGlyZTFXZlFuNzVSclY2VHMifQ.zOoruTDRqmjXXqlwOh260_EaLYX0BtySZLk8R0Emqxza7Xm_oB5zaxOrph9oShMaVJVBuZUactnDeevfqZMpVQ'

  const invalidToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE0ODUzMjExMzMsImhhcyI6IlFtV1lwelg2aG4ySmdoTlZoU1pHY01tOWRhbXJ1Nnhqd1pZWTlNcFpZcDNjcUgiLCJpc3MiOiJkaWQ6dXBvcnQ6Mm9zbmZKNFd5N0xCQW0yblBCWGlyZTFXZlFuNzVSclY2VHMifQ.EpAYedYq9IEqgGkvGyvUPsrqCKIqs98YlwpYyPKc46rlZcrJozrNog6lH4AyBW1d3ecJgdxwzq7PNzpgJFWY6A'
  beforeAll(() => {
    sut = new RootStoreAddressPost(uPortMgrMock, addressMgrMock)
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

  test('handle empty body', done => {
    sut.handle({ body: '{}' }, {}, (err, res) => {
      expect(err).not.toBeNull()
      expect(err.code).toEqual(401)
      expect(err.message).toEqual('Invalid JWT')
      done()
    })
  })

  test('handle invalid token', done => {
    sut.handle(
      { body: JSON.stringify({ event_token: 'a.s.df' }) },
      {},
      (err, res) => {
        expect(err).not.toBeNull()
        expect(err.code).toEqual(401)
        expect(err.message).toEqual('Invalid JWT')
        done()
      }
    )
  })

  test('handle invalid token', done => {
    const NOW = 1485321133
    MockDate.set(NOW * 1000 + 123)

    sut.handle(
      { body: JSON.stringify({ address_token: invalidToken }) },
      {},
      (err, res) => {
        expect(err).toBeDefined()
        expect(err.code).toEqual(401)
        expect(err.message).toEqual('Invalid JWT')
        done()
      }
    )
  })

  test('handle valid token, but error decoding it', done => {
    sut.handle(
      { body: JSON.stringify({ address_token: invalidAudToken }) },
      {},
      (err, res) => {
        expect(err).toBeDefined()
        expect(err.code).toEqual(401)
        expect(err.message).toEqual('Invalid JWT')
        done()
      }
    )
  })

  // This test isn't working, using uport did resolver
  // We need to update it to use muport (and 3id in future)
  test.skip('handle valid token', done => {
    sut.handle(
      {
        body: JSON.stringify({
          address_token: validToken
        })
      },
      {},
      (err, res) => {
        expect(err).toBeNull()
        expect(res).toEqual(
          '/orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVSU/first-database'
        )
        done()
      }
    )
  })
})
