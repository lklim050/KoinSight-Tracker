# API Dictionary

This document summarizes the backend routes defined in `server.js`, the transaction router, and the controller functions.

## Base Setup

- Base server entry: `backend/server.js`
- Transactions router mount path: `/transactions`
- JSON body parsing is enabled with `express.json()` and `express.urlencoded()`

## Quick View

| Method | Route                    | Purpose                                 | Success Response                                                                                                      |
| ------ | ------------------------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| GET    | `/assets`                | Fetch all asset records                 | Raw array of assets                                                                                                   |
| GET    | `/assets/seed`           | Seed asset records from `coinList.json` | `{ status: "ok", msg: "seed successfully, <n> entries created" }`                                                     |
| GET    | `/transactions/seed`     | Seed sample transactions                | `{ status: "ok", msg: "seeding success", count: "5 entries created" }`                                                |
| GET    | `/transactions`          | Fetch all transactions                  | `{ status: "fetch successfully", transactions: [ { ..., coinType: { id, symbol, name, image } } ] }`                  |
| PUT    | `/transactions`          | Create a transaction                    | `{ status: "ok", msg: "new transaction created successfully", show: { ..., coinType: { id, name, symbol, image } } }` |
| POST   | `/transactions/:transId` | Fetch one transaction by id             | `{ status: "ok", msg: "entry found", show: { ..., coinType: { id, name, symbol, image } } }`                          |
| PATCH  | `/transactions/:transId` | Update one transaction by id            | `{ status: "ok", msg: "update successfully", show: { ..., coinType: { id, name, symbol, image } } }`                  |
| DELETE | `/transactions/:transId` | Delete one transaction by id            | `{ status: "ok", msg: "entry [Buy bitcoin] deleted successfully " }`                                                  |

## Assets API

### `GET /assets`

Returns all asset records from the database.

Response:

```json
[
  {
    "_id": "bitcoin",
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "...",
    "current_price": 0,
    "market_cap_rank": 1
  }
]
```

Notes:

- The controller returns the raw array from `Assets.find()`.
- On failure, the route responds with `404` and:

```json
{
  "status": "error",
  "msg": "fail to update"
}
```

### `GET /assets/seed`

Deletes all existing assets and seeds the database from `coinList.json`.

Success response:

```json
{
  "status": "ok",
  "msg": "seed successfully, <n> entries created"
}
```

Failure response:

```json
{
  "status": "error",
  "msg": "fail to seed"
}
```

## Transactions API

### `GET /transactions/seed`

Deletes all existing transactions and seeds the database with sample transaction records.

Success response:

```json
{
  "status": "ok",
  "msg": "seeding success",
  "count": "5 entries created"
}
```

Failure response:

```json
{
  "status": "error",
  "msg": "fail to seed data"
}
```

### `GET /transactions`

Returns all transactions.

The controller populates the `coinType` field with asset details (`id`, `symbol`, `name`, `image`).

Success response (example with populated `coinType`):

```json
{
  "status": "fetch successfully",
  "transactions": [
    {
      "_id": "6a0b0f79e03e3f8a0c7caea6",
      "transType": "Buy",
      "coinType": {
        "id": "bitcoin",
        "symbol": "btc",
        "name": "Bitcoin",
        "image": "..."
      },
      "quantity": 0.02,
      "pricePerCoin": 77600.02,
      "fee": 2,
      "notes": "...",
      "date": "2026-06-10",
      "time": "14:00"
    }
  ]
}
```

Failure response:

```json
"cannot fetch data"
```

### `PUT /transactions`

Creates a new transaction.

Request body fields:

- `transType`
- `coinType`
- `quantity`
- `pricePerCoin`
- `fee` (optional)
- `notes` (optional)
- `date`
- `time`

Example request body:

```json
{
  "transType": "Buy",
  "coinType": "bitcoin",
  "quantity": 0.02,
  "pricePerCoin": 77600.02,
  "fee": 2,
  "notes": "test",
  "date": "2026-06-10",
  "time": "14:00"
}
```

Success response (note: `coinType` is populated):

```json
{
  "status": "ok",
  "msg": "new transaction created successfully",
  "show": {
    "transType": "Buy",
    "coinType": {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "image": "..."
    },
    "quantity": 0.02,
    "pricePerCoin": 77600.02,
    "fee": 2,
    "notes": "test",
    "date": "2026-06-10",
    "time": "14:00"
  }
}
```

Failure response:

```json
{
  "status": "error",
  "msg": "fail to create"
}
```

### `POST /transactions/:transId`

Fetches a single transaction by id.

Path parameter:

- `transId`: transaction document id

Success response (note: `coinType` is populated):

```json
{
  "status": "ok",
  "msg": "entry found",
  "show": {
    "transType": "Buy",
    "coinType": {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "image": "..."
    },
    "quantity": 0.02,
    "pricePerCoin": 77600.02,
    "fee": 2,
    "notes": "test",
    "date": "2026-06-10",
    "time": "14:00"
  }
}
```

Not-found response:

```json
{
  "status": "error",
  "msg": "id does not exist"
}
```

Failure response:

```json
{
  "status": "error",
  "msg": "fail to find"
}
```

### `PATCH /transactions/:transId`

Updates one or more fields on an existing transaction.

Path parameter:

- `transId`: transaction document id

Supported body fields are the same as the create route. Only provided fields are updated.

Success response (updated record is returned with populated `coinType`):

```json
{
  "status": "ok",
  "msg": "update successfully",
  "show": {
    "transType": "Buy",
    "coinType": {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "image": "..."
    },
    "quantity": 0.02,
    "pricePerCoin": 77600.02,
    "fee": 2,
    "notes": "test",
    "date": "2026-06-10",
    "time": "14:00"
  }
}
```

Failure response:

```json
{
  "status": "error",
  "msg": "fail to update"
}
```

### `DELETE /transactions/:transId`

Deletes a transaction by id.

Path parameter:

- `transId`: transaction document id

Success response:

```json
{
  "status": "ok",
  "msg": "entry [Buy bitcoin] deleted successfully "
}
```

Not-found response:

```json
{
  "status": "error",
  "msg": "id does not exist"
}
```

Failure response:

```json
{
  "status": "error",
  "msg": "fail to delete"
}
```

## Notes

- The transaction create route uses `PUT /transactions`, while the single-record fetch route uses `POST /transactions/:transId`.
- The code returns `404` for most failures, even when the issue is not strictly a missing resource.
- The route and controller file names use the existing project spelling `portofoiloTracker`.
