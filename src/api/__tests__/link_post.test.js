const LinkPostHandler = require("../link_post");

describe("LinkPostHandler", () => {
  let sut;

  beforeAll(() => {
    sut = new LinkPostHandler();
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
      expect(err.code).toEqual(403);
      expect(err.message).toEqual("no consent_signature");
      done();
    });
  });

  test.skip("handle invalid payload", done => {});
});
