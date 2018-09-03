import AWS from "aws-sdk";
import MockAWS from "aws-sdk-mock";
MockAWS.setSDKInstance(AWS);

const apiHandler = require("../api_handler");

describe("apiHandler", () => {
  beforeAll(() => {
    MockAWS.mock("KMS", "decrypt", Promise.resolve({ Plaintext: "{}" }));
    process.env.SECRETS = "badSecret";
  });

  test("hash_post()", done => {
    apiHandler.hash_post({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();
      done();
    });
  });

  test("hash_get()", done => {
    apiHandler.hash_get({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();
      done();
    });
  });

  test("link_post()", done => {
    apiHandler.link_post({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();
      done();
    });
  });
});
