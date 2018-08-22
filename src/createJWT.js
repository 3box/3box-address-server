const MockDate = require("mockdate");
const didJWT = require("did-jwt");
const NOW = 1485321133;
MockDate.set(NOW * 1000 + 123);

const audMnid = "2nQtiQG6Cgm1GYTBaaKAgr76uY7iSexUkqY";
const aud = `did:uport:${audMnid}`;
const mnid = "2nQtiQG6Cgm1GYTBaaKAgr76uY7iSexUkqX";
const did = `did:uport:${mnid}`;
const alg = "ES256K";

const privateKey =
  "278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f";
const publicKey =
  "03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479";

const signer = didJWT.SimpleSigner(
  "fa09a3ff0d486be2eb69545c393e2cf47cb53feb44a3550199346bdfa6f53245"
);
let jwt = "";
didJWT
  .createJWT(
    { has: "QmWYpzX6hn2JghNVhSZGcMm9damru6xjwZYY9MpZYp3cqH" },
    { issuer: "did:uport:2osnfJ4Wy7LBAm2nPBXire1WfQn75RrV6Ts", signer }
  )
  .then(jwt => {
    console.log(jwt);
  })
  .catch(e => {
    console.log("Error", e);
  });
