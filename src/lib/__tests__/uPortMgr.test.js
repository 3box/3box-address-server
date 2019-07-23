const UportMgr = require("../uPortMgr");

describe("UportMgr", () => {
  let sut;
  let jwts = {
    legacy:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiIyb3pzRlFXQVU3Q3BIWkxxdTJ3U1liSkZXekROQjI2YW9DRiIsImlhdCI6MTUxMzM1MjgzNCwiZXZlbnQiOnsidHlwZSI6IlNUT1JFX0NPTk5FQ1RJT04iLCJhZGRyZXNzIjoiMm96c0ZRV0FVN0NwSFpMcXUyd1NZYkpGV3pETkIyNmFvQ0YiLCJjb25uZWN0aW9uVHlwZSI6ImNvbnRyYWN0cyIsImNvbm5lY3Rpb24iOiIweDJjYzMxOTEyYjJiMGYzMDc1YTg3YjM2NDA5MjNkNDVhMjZjZWYzZWUifSwiZXhwIjoxNTEzNDM5MjM0fQ.tqX5eEuaTEyYPUSgatK5zEsj_WpE-dIEHDc4ItpOvAZuBkSyV9_zbb0puNtDrZTVA7MlZ43FSSpf9CGIUxup-w"
  };
  beforeAll(() => {
    sut = new UportMgr();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("verifyToken() no token", done => {
    sut
      .verifyToken(null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err.message).toEqual("no token");
        done();
      });
  });

  // This test isn't working, using uport did resolver
  // We need to update it to use muport (and 3id in future)
  describe.skip("verifyToken() happy path", () => {
    const DATE_TO_USE = new Date(1513399280000);
    Object.keys(jwts).forEach(didType => {
      test(didType, done => {
        const eventToken = jwts[didType];
        Date.now = jest.fn(() => DATE_TO_USE);

        sut.verifyToken(eventToken).then(
          resp => {
            expect(resp.jwt).toEqual(eventToken);
            expect(resp.payload.event.address).toEqual(
              "2ozsFQWAU7CpHZLqu2wSYbJFWzDNB26aoCF"
            );
            done();
          },
          error => {
            expect(error).toBeUndefined();
            done();
          }
        );
      });
    });
  });
});
