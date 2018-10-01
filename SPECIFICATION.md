# 3box-address-server specification
The implementation of this can be found at [3box-address-server](https://github.com/uport-project/3box-address-server.git)

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
    linked_did: <DID>
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


### Delete root store address
TBD

### Delete link
TBD

