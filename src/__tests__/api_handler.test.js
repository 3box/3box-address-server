import AWS from 'aws-sdk'
import MockAWS from 'aws-sdk-mock'
MockAWS.setSDKInstance(AWS)

const apiHandler = require('../api_handler')

describe('apiHandler', () => {
  beforeAll(() => {
    MockAWS.mock('KMS', 'decrypt', Promise.resolve({ Plaintext: '{}' }))
    process.env.SECRETS = 'badSecret'
  })

  test('root_store_address_post()', done => {
    apiHandler.root_store_address_post({}, {}, (err, res) => {
      expect(err).toBeNull()
      expect(res).not.toBeNull()
      done()
    })
  })

  test('root_store_address_get()', done => {
    apiHandler.root_store_address_get({}, {}, (err, res) => {
      expect(err).toBeNull()
      expect(res).not.toBeNull()
      done()
    })
  })

  test('link_post()', done => {
    apiHandler.link_post({}, {}, (err, res) => {
      expect(err).toBeNull()
      expect(res).not.toBeNull()
      done()
    })
  })
})
