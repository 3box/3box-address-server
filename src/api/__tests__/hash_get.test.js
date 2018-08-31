const HashGetHandler = require("../hash_get");

describe("LinkPostHandler", () => {
  let sut;
  let storageMgrMock;

  beforeAll(() => {
    storageMgrMock = {
      connect: jest.fn(),
      end: jest.fn()
    };
    sut = new HashGetHandler(storageMgrMock);
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
    sut.handle({}, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(400);
      expect(err.message).toEqual("No identity parameter");
      done();
    });
  });
});
