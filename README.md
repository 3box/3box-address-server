# 3Box Address Server

[![Greenkeeper badge](https://badges.greenkeeper.io/3box/3box-address-server.svg)](https://greenkeeper.io/)

`3box-address-server` is a server utilizing a REST-API that is used to associate an Ethereum address with its root OrbitDB address. This is what must be looked up to sync the user's data.

## API Endpoint

```
https://beta.3box.io/address-server/
```

## API Description


### Set

`POST /odbAddress`

#### Body

```
{
    address_token: <jwt token containing the orbitDB root store address>
}
```

The `address_token` is a [DID signed jwt](https://github.com/uport-project/did-jwt.git) of the address to be published. The payload of the `address_token` is:
```
{
    rootStoreAddress: <orbitdb root store address>
}
```

#### Response

| Status |     Message    |                                                   |
|:------:|----------------|---------------------------------------------------|
| 200    | Ok.            | rootStoreAddress stored                           |
| 401    | Invalid JWT    | Posted token is invalid (signature, expired, etc) |
| 403    | Missing data   | no `rootStoreAddress` in `address_token`          |
| 500    | Internal Error | Internal Error                                    |

The response data follows the [`jsend`](https://labs.omniti.com/labs/jsend) standard.

#### Response data
```
{
  status: 'success',
  data: {
    rootStoreAddress: <the orbitDB root store address that was accepted>
  }
}
```

### Link an ethereum address to a DID

`POST /link`


#### Body

```
{
    consent_signature: <signature>,
    linked_did: <DID>,
    consent_msg: <string-message>
}
```

The `consent_signature` is a [personal_sign signature](https://web3js.readthedocs.io/en/1.0/web3-eth-personal.html) of a consent message and the DID to be linked. The data(text) of the signature is:

```
Create a new 3Box profile

-
Your unique profile ID is did:muport:Qmsd89f7hg0w845hsdd
```


The ethereum address to be linked is recovered from the signature.

#### Response

| Status |     Message     |                                                  |
|:------:|-----------------|--------------------------------------------------|
| 200    | Ok.             | Link created and stored                          |
| 400    | Bad request     | No did on the message or dids does not match     |
| 401    | Invalid consent | Posted signature is invalid (wrong DID, etc)     |
| 403    | Missing data    | no `consent_signature` or `linked_did`           |
| 500    | Internal Error  | Internal Error                                   |

The response data follows the [`jsend`](https://labs.omniti.com/labs/jsend) standard.

#### Response data
```
{
  status: 'success',
  data: {
    did: <the did that was linked>,
    address: <the ethereum address that was linked>
  }
}
```

### Delete a link between an ethereum address and a DID

`POST /linkdelete`

#### Body

```
{
  delete_token: <jwt token>
}
```

The `delete_token` is a [DID signed jwt](https://github.com/uport-project/did-jwt.git) with a 1 hour expiry, of the address to be deleted. The payload of the `delete_token` is:

```
{
  "address": "0x19bd82476fa8799e0eb7bbb03ee2a67678c01cdc",
  "type": "delete-address-link"
}
```

#### Response

| Status |     Message     |                                                  |
|:------:|-----------------|--------------------------------------------------|
| 200    | Ok.             | Link deleted                                     |
| 401    | Invalid consent | delete token failed verification                 |
| 403    | Missing data    | no delete_token                                  |
| 500    | Internal Error  | Internal Error                                   |

The response data follows the [`jsend`](https://labs.omniti.com/labs/jsend) standard.

#### Response data
```
{
  status: 'success',
  data: 'address of link deleted'
}
```

### Get orbitDB root store address for given identity

`GET /odbAddress/{identity}`

Here the `ìdentity` is either a `DID` or an `ethereum address`.

#### Response

| Status |     Message     |                                                  |
|:------:|-----------------|--------------------------------------------------|
| 200    | Ok.             | An orbitDB address is returned                   |
| 404    | Not found       | The DID or ethereum address was not found        |
| 500    | Internal Error  | Internal Error                                   |

The response data follows the [`jsend`](https://labs.omniti.com/labs/jsend) standard.

#### Response data
```
{
  status: 'success',
  data: {
    rootStoreAddress: <the orbitDB root store address associated with the identity>
  }
}
```


### Get multiple orbitDB root store addresses for given identities

`Post /odbAddresses`

Returns multiple root store addresses from multiple identities. If some identities are present but not all, the response will only contain the ones that do have root store addresses associated with them.

#### Body

```
{
    identities: <an array containing identities as strings>
}
```

Here the `ìdentity` is either a `DID` or an `ethereum address`.

#### Response

| Status |     Message     |                                                    |
|:------:|-----------------|----------------------------------------------------|
| 200    | Ok.             | All or some of the orbitDB addresses are returned  |
| 400    | Bad request     | No identities found in request                     |
| 404    | Not found       | No matching orbitDB addresses where found          |
| 500    | Internal Error  | Internal Error                                     |

The response data follows the [`jsend`](https://labs.omniti.com/labs/jsend) standard.

#### Response data
```
{
  status: 'success',
  data: {
    rootStoreAddresses: {
      <identity>: <the orbitDB root store address associated with the identity, or null if no match for this identity>
    }
  }
}
```
