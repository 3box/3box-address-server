const HashGetHandler = require("../hash_get");

describe("LinkPostHandler", () => {
  let sut;
  let ipfsMgrMock;

  beforeAll(() => {
    ipfsMgrMock = jest.fn();
    sut = new HashGetHandler(ipfsMgrMock);
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("no parameters", done => {
    sut.handle({}, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(400);
      done();
    });
  });

  test.skip("GET identity not found", done => {
    this.ipfsMgr = null;
    sut.handle({}, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(400);
      expect(err.message).toEqual("No identity parameter");
      done();
    });
  });
});
