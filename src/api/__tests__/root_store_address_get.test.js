const RootStoreAddressGet = require('../root_store_address_get')

describe('RootStoreAddressGet', () => {
  let sut
  let addressMgrMock
  let linkMgrMock
  let address = '0xbf7571b900839fa871e6f6efbbfd238eaa502735'
  let did = 'did:muport:QmRhjfL4HLdB8LovGf1o43NJ8QnbfqmpdnTuBvZTewnuBV'
  let rsAddress = '/orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVSU/first-database'

  beforeAll(() => {
    addressMgrMock = {
      get: jest.fn()
    }
    linkMgrMock = {
      get: jest.fn()
    }
    sut = new RootStoreAddressGet(addressMgrMock, linkMgrMock)
  })

  afterEach(() => {
    addressMgrMock.get.mockReset()
    linkMgrMock.get.mockReset()
  })

  test('empty constructor', () => {
    expect(sut).not.toBeUndefined()
  })

  test('no parameters', done => {
    sut.handle({}, {}, (err, res) => {
      expect(err).not.toBeNull()
      expect(err.code).toEqual(400)
      expect(err.message).toEqual('no id parameter')
      done()
    })
  })

  test('handle not linked address', done => {
    sut.handle({ pathParameters: { id: address } }, {}, (err, res) => {
      linkMgrMock.get.mockReturnValue(null)

      expect(linkMgrMock.get).toBeCalledWith(address)

      expect(err).not.toBeNull()
      expect(err.code).toEqual(404)
      expect(err.message).toEqual('address not linked')
      done()
    })
  })

  test('handle invalid id', done => {
    sut.handle({ pathParameters: { id: 'badId' } }, {}, (err, res) => {
      expect(err).not.toBeNull()
      expect(err.code).toEqual(401)
      expect(err.message).toEqual('invalid id')
      done()
    })
  })

  test('handle rootStoreAddress not found', done => {
    sut.handle({ pathParameters: { id: did } }, {}, (err, res) => {
      addressMgrMock.get.mockReturnValue(null)

      expect(addressMgrMock.get).toBeCalledWith(did)

      expect(err).not.toBeNull()
      expect(err.code).toEqual(404)
      expect(err.message).toEqual('root store address not found')
      done()
    })
  })

  test('adress contains uppercase', done => {
    let invalidAddress = '0xBF7571b900839fa871e6f6efbbfd238eaa502735'
    linkMgrMock.get.mockReturnValue({ did: did })
    addressMgrMock.get.mockReturnValue({ root_store_address: rsAddress })

    sut.handle({ pathParameters: { id: invalidAddress } }, {}, (err, res) => {
      expect(err).not.toBeNull()
      expect(err.code).toEqual(403)
      expect(err.message).toEqual('Error: must be a lowercase hex string')
      done()
    })
  })

  test('happy path (address)', done => {
    linkMgrMock.get.mockReturnValue({ did: did })
    addressMgrMock.get.mockReturnValue({ root_store_address: rsAddress })

    sut.handle({ pathParameters: { id: address } }, {}, (err, res) => {
      expect(linkMgrMock.get).toBeCalledWith(address)
      expect(addressMgrMock.get).toBeCalledWith(did)

      expect(err).toBeNull()
      expect(res).not.toBeNull()
      expect(res).toEqual({ rootStoreAddress: rsAddress, did })
      done()
    })
  })

  test('happy path (did)', done => {
    addressMgrMock.get.mockReturnValue({ root_store_address: rsAddress })

    sut.handle({ pathParameters: { id: did } }, {}, (err, res) => {

      expect(addressMgrMock.get).toBeCalledWith(did)
      expect(err).toBeNull()
      expect(res).not.toBeNull()
      expect(res).toEqual({ rootStoreAddress: rsAddress, did })
      done()
    })
  })
})
