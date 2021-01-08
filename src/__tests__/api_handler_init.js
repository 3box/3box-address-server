import AWS from 'aws-sdk'
import MockAWS from 'aws-sdk-mock'
MockAWS.setSDKInstance(AWS)

jest.mock('ipfs-s3-dag-get', () => {
  return {
    initIPFS: jest.fn()
  }
})

jest.mock('pg')
import { Client } from 'pg'
let pgClientMock = {
  connect: jest.fn(),
  end: jest.fn()
}
Client.mockImplementation(() => {
  return pgClientMock
})

const { initIPFS: initIPFSMock } = require('ipfs-s3-dag-get')

describe('apiHandler', () => {
  const AddressMgr = require('../lib/addressMgr')
  const LinkMgr = require('../lib/linkMgr')
  const UportMgr = require('../lib/uPortMgr')
  let originalEnv
  let addressSetSecretsMock
  let linkSetSecretsMock
  let uPortSetSecretsMock
  let kmsDecryptMock
  let addressSetClientMock
  let linkSetClientMock

  beforeAll(() => {
    kmsDecryptMock = jest.fn()
    MockAWS.mock('KMS', 'decrypt', kmsDecryptMock)
    process.env.SECRETS = 'badSecret'
  })

  beforeEach(() => {
    initIPFSMock.mockReset().mockResolvedValue('ipfs')
    kmsDecryptMock.mockReset().mockResolvedValue({ Plaintext: '{}' })
    originalEnv = { ...process.env }
    addressSetSecretsMock = jest.spyOn(AddressMgr.prototype, 'setSecrets')
    linkSetSecretsMock = jest.spyOn(LinkMgr.prototype, 'setSecrets')
    uPortSetSecretsMock = jest.spyOn(UportMgr.prototype, 'setSecrets')
    addressSetClientMock = jest.spyOn(AddressMgr.prototype, 'setClient')
    linkSetClientMock = jest.spyOn(LinkMgr.prototype, 'setClient')
  })

  afterEach(() => {
    process.env = originalEnv
    addressSetSecretsMock.mockRestore()
    linkSetSecretsMock.mockRestore()
    uPortSetSecretsMock.mockRestore()
    addressSetClientMock.mockRestore()
    linkSetClientMock.mockRestore()
  })

  test('should be configured from environment variables if they are valid', (done) => {
    process.env.PG_URL = 'postgresql://user:pass@host/db'
    jest.isolateModules(() => {
      const apiHandler = require('../api_handler')

      apiHandler.root_store_address_get({}, {}, (err, res) => {

        expect(addressSetSecretsMock).toHaveBeenCalledTimes(1)
        expect(linkSetSecretsMock).toHaveBeenCalledTimes(1)
        expect(uPortSetSecretsMock).toHaveBeenCalledTimes(1)
        expect(kmsDecryptMock).not.toHaveBeenCalled()
        expect(addressSetClientMock).toHaveBeenCalledTimes(1)
        expect(linkSetClientMock).toHaveBeenCalledTimes(1)

        done()
      })
    })
  })

  test('should be configured from KMS if environment variables are not valid', (done) => {
    jest.isolateModules(() => {
      const apiHandler = require('../api_handler')

      apiHandler.root_store_address_get({}, {}, (err, res) => {

        expect(addressSetSecretsMock).toHaveBeenCalledTimes(2)
        expect(linkSetSecretsMock).toHaveBeenCalledTimes(2)
        expect(uPortSetSecretsMock).toHaveBeenCalledTimes(2)
        expect(kmsDecryptMock).toHaveBeenCalled()
        expect(addressSetClientMock).toHaveBeenCalledTimes(1)
        expect(linkSetClientMock).toHaveBeenCalledTimes(1)

        done()
      })
    })
  })

  test('should be configured from KMS if IPFS can\'t be initialized from environment variables', (done) => {
    initIPFSMock.mockRejectedValueOnce()
    process.env.PG_URL = 'postgresql://user:pass@host/db'
    jest.isolateModules(() => {
      const apiHandler = require('../api_handler')

      apiHandler.root_store_address_get({}, {}, (err, res) => {

        expect(addressSetSecretsMock).toHaveBeenCalledTimes(2)
        expect(linkSetSecretsMock).toHaveBeenCalledTimes(2)
        expect(uPortSetSecretsMock).toHaveBeenCalledTimes(2)
        expect(kmsDecryptMock).toHaveBeenCalled()
        expect(addressSetClientMock).toHaveBeenCalledTimes(1)
        expect(linkSetClientMock).toHaveBeenCalledTimes(1)

        done()
      })
    })
  })
})
