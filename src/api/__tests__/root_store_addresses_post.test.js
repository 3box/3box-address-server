const RootStoreAddressesPost = require('../root_store_addresses_post')

const formatEvent = obj => {
  return { body: JSON.stringify(obj) }
}

describe('RootStoreAddressesPost', () => {
  let sut
  let addressMgrMock
  let linkMgrMock
  let address1 = '0xbf7571b900839fa871e6f6efbbfd238eaa502735'
  let address2 = '0xbf7571b900839fa871e6f6efbbfd238eaa502736'
  let did1 = 'did:muport:QmRhjfL4HLdB8LovGf1o43NJ8QnbfqmpdnTuBvZTewnuB1'
  let did2 = 'did:muport:QmRhjfL4HLdB8LovGf1o43NJ8QnbfqmpdnTuBvZTewnuB2'
  let did3 = 'did:muport:QmRhjfL4HLdB8LovGf1o43NJ8QnbfqmpdnTuBvZTewnuB3'
  let did4 = 'did:muport:QmRhjfL4HLdB8LovGf1o43NJ8QnbfqmpdnTuBvZTewnuB4'
  let rsAddress1 = '/orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVS1/first-database'
  let rsAddress2 = '/orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVS2/first-database'
  let rsAddress3 = '/orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVS3/first-database'
  let rsAddress4 = '/orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVS4/first-database'

  beforeEach(() => {
    addressMgrMock = {
      get: jest.fn().mockImplementation(did => {
        if (did === did1) {
          return { root_store_address: rsAddress1 }
        } else if (did === did2) {
          return { root_store_address: rsAddress2 }
        } else if (did === did3) {
          return { root_store_address: rsAddress3 }
        } else if (did === did4) {
          return { root_store_address: rsAddress4 }
        }
      })
    }
    linkMgrMock = {
      get: jest.fn().mockImplementation(addr => {
        if (addr === address1) {
          return { did: did1 }
        } else if (addr === address2) {
          return { did: did2 }
        }
      })
    }
    sut = new RootStoreAddressesPost(addressMgrMock, linkMgrMock)
  })

  afterEach(() => {
    addressMgrMock.get.mockReset()
    linkMgrMock.get.mockReset()
  })

  test('empty constructor', () => {
    expect(sut).not.toBeUndefined()
  })

  test('no body', done => {
    sut.handle({}, {}, (err, res) => {
      expect(err).not.toBeNull()
      expect(err.code).toEqual(403)
      expect(err.message).toContain('no json body: ')
      done()
    })
  })

  test('no parameters', done => {
    sut.handle(formatEvent({}), {}, (err, res) => {
      expect(err).not.toBeNull()
      expect(err.code).toEqual(400)
      expect(err.message).toContain('no identities in parameter')
      sut.handle(formatEvent({ identities: "asdf" }), {}, (err, res) => {
        expect(err).not.toBeNull()
        expect(err.code).toEqual(400)
        expect(err.message).toContain('no identities in parameter')
        sut.handle(formatEvent({ identities: [] }), {}, (err, res) => {
          expect(err).not.toBeNull()
          expect(err.code).toEqual(400)
          expect(err.message).toContain('no identities in parameter')
          done()
        })
      })
    })
  })

  test('happy path (dids)', done => {

    sut.handle(formatEvent({ identities: [did1, did2, did3, did4] }), {}, (err, res) => {
      expect(addressMgrMock.get).toHaveBeenCalledWith(did1)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did2)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did3)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did4)
      expect(addressMgrMock.get).toHaveBeenCalledTimes(4)
      expect(err).toBeNull()
      const expectedRes = { rootStoreAddresses: {} }
      expectedRes.rootStoreAddresses[did1] = rsAddress1
      expectedRes.rootStoreAddresses[did2] = rsAddress2
      expectedRes.rootStoreAddresses[did3] = rsAddress3
      expectedRes.rootStoreAddresses[did4] = rsAddress4
      expect(res).toEqual(expectedRes)
      done()
    })
  })

  test('happy path (addresses)', done => {

    sut.handle(formatEvent({ identities: [address1, address2] }), {}, (err, res) => {
      expect(linkMgrMock.get).toHaveBeenCalledWith(address1)
      expect(linkMgrMock.get).toHaveBeenCalledWith(address2)
      expect(linkMgrMock.get).toHaveBeenCalledTimes(2)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did1)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did2)
      expect(addressMgrMock.get).toHaveBeenCalledTimes(2)
      expect(err).toBeNull()
      const expectedRes = { rootStoreAddresses: {} }
      expectedRes.rootStoreAddresses[address1] = rsAddress1
      expectedRes.rootStoreAddresses[address2] = rsAddress2
      expect(res).toEqual(expectedRes)
      done()
    })
  })

  test('happy path (mixed dids, addresses)', done => {

    sut.handle(formatEvent({ identities: [address1, address2, did3, did4] }), {}, (err, res) => {
      expect(linkMgrMock.get).toHaveBeenCalledWith(address1)
      expect(linkMgrMock.get).toHaveBeenCalledWith(address2)
      expect(linkMgrMock.get).toHaveBeenCalledTimes(2)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did1)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did2)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did3)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did4)
      expect(addressMgrMock.get).toHaveBeenCalledTimes(4)
      expect(err).toBeNull()
      const expectedRes = { rootStoreAddresses: {} }
      expectedRes.rootStoreAddresses[address1] = rsAddress1
      expectedRes.rootStoreAddresses[address2] = rsAddress2
      expectedRes.rootStoreAddresses[did3] = rsAddress3
      expectedRes.rootStoreAddresses[did4] = rsAddress4
      expect(res).toEqual(expectedRes)
      done()
    })
  })

  test('happy path (mixed dids, addresses, non linked address)', done => {
    linkMgrMock.get.mockReset()
    linkMgrMock.get.mockReturnValueOnce({ did: did1 })
    // here address2 is not linked
    sut.handle(formatEvent({ identities: [address1, address2, did3, did4] }), {}, (err, res) => {
      expect(linkMgrMock.get).toHaveBeenCalledWith(address1)
      expect(linkMgrMock.get).toHaveBeenCalledWith(address2)
      expect(linkMgrMock.get).toHaveBeenCalledTimes(2)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did1)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did3)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did4)
      expect(addressMgrMock.get).toHaveBeenCalledTimes(3)
      expect(err).toBeNull()
      const expectedRes = { rootStoreAddresses: {} }
      expectedRes.rootStoreAddresses[address1] = rsAddress1
      expectedRes.rootStoreAddresses[did3] = rsAddress3
      expectedRes.rootStoreAddresses[did4] = rsAddress4
      expect(res).toEqual(expectedRes)
      done()
    })
  })

  test('happy path (mixed dids, addresses, non published rootStore)', done => {
    addressMgrMock.get = jest.fn().mockImplementation(did => {
      if (did === did1) {
        return { root_store_address: rsAddress1 }
      } else if (did === did3) {
        return { root_store_address: rsAddress3 }
      }
    })

    sut.handle(formatEvent({ identities: [address1, address2, did3, did4] }), {}, (err, res) => {
      expect(linkMgrMock.get).toHaveBeenCalledWith(address1)
      expect(linkMgrMock.get).toHaveBeenCalledWith(address2)
      expect(linkMgrMock.get).toHaveBeenCalledTimes(2)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did1)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did2)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did3)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did4)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did4)
      expect(addressMgrMock.get).toHaveBeenCalledTimes(4)
      expect(err).toBeNull()
      const expectedRes = { rootStoreAddresses: {} }
      expectedRes.rootStoreAddresses[address1] = rsAddress1
      expectedRes.rootStoreAddresses[did3] = rsAddress3
      expect(res).toEqual(expectedRes)
      done()
    })
  })

  test('happy path (mixed dids, addresses, invalid id)', done => {
    sut.handle(formatEvent({ identities: [address1, 'invalidId', did3, did4] }), {}, (err, res) => {
      expect(linkMgrMock.get).toHaveBeenCalledWith(address1)
      expect(linkMgrMock.get).toHaveBeenCalledTimes(1)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did1)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did3)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did4)
      expect(addressMgrMock.get).toHaveBeenCalledTimes(3)
      expect(err).toBeNull()
      const expectedRes = { rootStoreAddresses: {} }
      expectedRes.rootStoreAddresses[address1] = rsAddress1
      expectedRes.rootStoreAddresses[did3] = rsAddress3
      expectedRes.rootStoreAddresses[did4] = rsAddress4
      expect(res).toEqual(expectedRes)
      done()
    })
  })

  test('happy path (mixed dids, addresses, upper-case addresses)', done => {
    sut.handle(formatEvent({ identities: [address1, '0xBF7571b900839fa871e6f6efbbfd238eaa502736', did3, did4] }), {}, (err, res) => {
      expect(linkMgrMock.get).toHaveBeenCalledWith(address1)
      expect(linkMgrMock.get).toHaveBeenCalledTimes(1)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did1)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did3)
      expect(addressMgrMock.get).toHaveBeenCalledWith(did4)
      expect(addressMgrMock.get).toHaveBeenCalledTimes(3)
      expect(err).toBeNull()
      const expectedRes = { rootStoreAddresses: {} }
      expectedRes.rootStoreAddresses[address1] = rsAddress1
      expectedRes.rootStoreAddresses[did3] = rsAddress3
      expectedRes.rootStoreAddresses[did4] = rsAddress4
      expect(res).toEqual(expectedRes)
      done()
    })
  })
})
