import { TokenVerifier, SimpleSigner } from "did-jwt";

const HashPostHandler = require("../hash_post");

const UportMgr = require("../../lib/uPortMgr");
const HashMgr = require("../../lib/hashMgr");

const MockDate = require("mockdate");

describe("HashPostHandler", () => {
  let sut;
  let uPortMgrMock = new UportMgr();
  let hashMgrMock = new HashMgr();

  const privateKey =
    "278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f";
  const publicKey =
    "03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479";
  const validToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE0ODUzMjExMzMsImhhc2giOiJRbVdZcHpYNmhuMkpnaE5WaFNaR2NNbTlkYW1ydTZ4andaWVk5TXBaWXAzY3FIIiwiaXNzIjoiZGlkOnVwb3J0OjJvc25mSjRXeTdMQkFtMm5QQlhpcmUxV2ZRbjc1UnJWNlRzIn0.gwkXqTB0MiPLj12wwyRddgq67GFZLHegCdtnOTnc6wrmA-6u8y0Am1BKne3-5CB5_uuxpqIWNLS2ZIpdW9s0LA";
  const invalidToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE0ODUzMjExMzMsImhhcyI6IlFtV1lwelg2aG4ySmdoTlZoU1pHY01tOWRhbXJ1Nnhqd1pZWTlNcFpZcDNjcUgiLCJpc3MiOiJkaWQ6dXBvcnQ6Mm9zbmZKNFd5N0xCQW0yblBCWGlyZTFXZlFuNzVSclY2VHMifQ.EpAYedYq9IEqgGkvGyvUPsrqCKIqs98YlwpYyPKc46rlZcrJozrNog6lH4AyBW1d3ecJgdxwzq7PNzpgJFWY6A";
  beforeAll(() => {
    sut = new HashPostHandler(uPortMgrMock, hashMgrMock);
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("handle null body", done => {
    sut.handle({}, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(403);
      expect(err.message).toBeDefined();
      done();
    });
  });

  test("handle empty body", done => {
    sut.handle({ body: "{}" }, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(401);
      expect(err.message).toEqual("Invalid JWT");
      done();
    });
  });

  test("handle invalid token", done => {
    sut.handle(
      { body: JSON.stringify({ event_token: "a.s.df" }) },
      {},
      (err, res) => {
        expect(err).not.toBeNull();
        expect(err.code).toEqual(401);
        expect(err.message).toEqual("Invalid JWT");
        done();
      }
    );
  });

  test("handle invalid token", done => {
    const NOW = 1485321133;
    MockDate.set(NOW * 1000 + 123);

    sut.handle(
      { body: JSON.stringify({ hash_token: invalidToken }) },
      {},
      (err, res) => {
        expect(err).toBeDefined();
        expect(err.code).toEqual(403);
        expect(err.message).toEqual("Missing data");
        done();
      }
    );
  });
  test("handle valid token", done => {
    const NOW = 1485321133;
    MockDate.set(NOW * 1000 + 123);

    sut.handle(
      { body: JSON.stringify({ hash_token: validToken }) },
      {},
      (err, res) => {
        expect(err).toBeNull();
        expect(res).toEqual("QmWYpzX6hn2JghNVhSZGcMm9damru6xjwZYY9MpZYp3cqH");
        done();
      }
    );
  });
});
