jest.mock('pg')
import { Client } from 'pg'
let pgClientMock = {
  connect: jest.fn(),
  end: jest.fn()
}
Client.mockImplementation(() => {
  return pgClientMock
})
const AddressMgr = require('../addressMgr')

describe('AddressMgr', () => {
  let sut
  let rsAddress = 'QmWYpzX6hn2JghNVhSZGcMm9damru6xjwZYY9MpZYp3cqH'
  let did = 'did:muport:QmRhjfL4HLdB8LovGf1o43NJ8QnbfqmpdnTuBvZTewnuBV'

  beforeEach(() => {
    sut = new AddressMgr()
  })

  test('is isSecretsSet', () => {
    let secretSet = sut.isSecretsSet()
    expect(secretSet).toEqual(false)
  })

  test('get() no pgUrl set', done => {
    sut
      .get(did)
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('no pgUrl set')
        done()
      })
  })

  test.skip('store() no pgUrl set', done => {
    sut
      .store(rsAddress,did)
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('no pgUrl set')
        done()
      })
  })

  test('setSecrets', () => {
    expect(sut.isSecretsSet()).toEqual(false)
    sut.setSecrets({ PG_URL: 'fake' })
    expect(sut.isSecretsSet()).toEqual(true)
    expect(sut.pgUrl).not.toBeUndefined()
  })

  test('get() no did', done => {
    sut
      .get()
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('no did')
        done()
      })
  })

  test.skip('get() fail pg', done => {
    sut.setSecrets({ PG_URL: 'fake' })
    pgClientMock.connect = jest.fn( () =>{
      throw new Error("pg failed");
    })
    sut
      .get(did)
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('pg failed')
        done()
      })
  })


  test('get() did', done => {
    sut.setSecrets({ PG_URL: 'fake' })

    pgClientMock.connect = jest.fn()
    pgClientMock.connect.mockClear()
    pgClientMock.end.mockClear()
    pgClientMock.query = jest.fn(() => {
      return Promise.resolve({ rows: [rsAddress] })
    })

    sut.setClient(pgClientMock)
    sut.get(did).then(resp => {
      //expect(pgClientMock.connect).toBeCalled()
      expect(pgClientMock.query).toBeCalled()
      expect(
        pgClientMock.query
      ).toBeCalledWith(
        `SELECT root_store_address FROM root_store_addresses WHERE did = $1`,
        [did]
      )
      //expect(pgClientMock.end).toBeCalled()
      expect(resp).toEqual(rsAddress)

      done()
    })
  })

  test('store() no root store address', done => {
    sut
      .store()
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('no root store address')
        done()
      })
  })

  test('store() no did', done => {
    sut
      .store(rsAddress)
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('no did')
        done()
      })
  })

  test.skip('store() fail pg', done => {
    sut.setSecrets({ PG_URL: 'fake' })
    pgClientMock.connect = jest.fn( () =>{
      throw new Error("pg failed");
    })
    sut
      .store(rsAddress,did)
      .then(resp => {
        fail("shouldn't return")
        done()
      })
      .catch(err => {
        expect(err.message).toEqual('pg failed')
        done()
      })
  })

  test('store() happy path', done => {
    sut.setSecrets({ PG_URL: 'fake' })

    pgClientMock.connect = jest.fn()
    pgClientMock.connect.mockClear()
    pgClientMock.end.mockClear()
    pgClientMock.query = jest.fn(() => {
      return Promise.resolve(true)
    })

    sut.setClient(pgClientMock)
    sut.store(rsAddress, did).then(resp => {
      //expect(pgClientMock.connect).toBeCalled()
      expect(pgClientMock.query).toBeCalled()
      expect(
        pgClientMock.query
      ).toBeCalledWith(
        `INSERT INTO root_store_addresses(root_store_address, did) VALUES ($1, $2) ON CONFLICT (did) DO UPDATE SET root_store_address = EXCLUDED.root_store_address`,
        [rsAddress, did]
      )
      //expect(pgClientMock.end).toBeCalled()
      expect(resp).toBeTruthy()
      done()
    })
  })
})
