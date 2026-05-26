# API Dictionary

Simple reference for the backend routes defined in `backend/server.js` and the mounted routers/controllers.

## Setup ENVIRONMENT VARIABLES

| Key    | Value                   | Comment                                                    |
| ------ | ----------------------- | ---------------------------------------------------------- |
| server | `http://localhost:5001` | port number is defined by your server app.listen           |
| token  | ----------------------- | leave the value empty as it will be written by post script |

## Auth

- Choose Bearer Token and write {{token}}, to be filled in by your environment variables

## Post-Script

For Login only, add the following line at post script of bruno. This is used to set your environment variables

- Note: Vary depending on how the login controller or middleware is written.

```
const jsonData = res.getBody();
bru.setEnvVar("token",jsonData.token);
```

## Auth

| Endpoint        | Method | Required (params or body)             | Expected response                                              |
| --------------- | ------ | ------------------------------------- | -------------------------------------------------------------- |
| `/auth/signup`  | `POST` | Body: `username`, `email`, `password` | `201` with `{ message, user: { id, username, email } }`        |
| `/auth/login`   | `POST` | Body: `email`, `password`             | `200` with `{ message, token, user: { id, username, email } }` |
| `/auth/profile` | `GET`  | Auth required                         | `200` with `{ message: "Protected route accessed", user }`     |

## Assets

| Endpoint       | Method | Required (params or body) | Expected response                                                            |
| -------------- | ------ | ------------------------- | ---------------------------------------------------------------------------- |
| `/assets`      | `GET`  | None                      | `200` with an array of asset records                                         |
| `/assets/seed` | `GET`  | None                      | `200` with `{ status: "ok", msg: "seed successfully, <n> entries created" }` |

## Transactions

- Note: requires login (Refer to Auth, run bruno POST /auth/login, if no account, use /auth/signup to create account before login)

| Endpoint                 | Method   | Required (params or body)                                               | Expected response                                                                     |
| ------------------------ | -------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `/transactions/seed`     | `GET`    | Auth required                                                           | `200` with `{ status: "ok", msg: "seeding success", count: "5 entries created" }`     |
| `/transactions`          | `GET`    | Auth required                                                           | `200` with `{ status: "fetch successfully", user, transactions: [...] }`              |
| `/transactions`          | `PUT`    | Auth required. Body: `transType`, `coinType`, `date`, `time`            | `200` with `{ status: "ok", msg: "transaction created successfully", create: {...} }` |
| `/transactions/:transId` | `POST`   | Auth required. Param: `transId`                                         | `200` with `{ status: "ok", msg: "entry found", show: {...} }`                        |
| `/transactions/:transId` | `PATCH`  | Auth required. Param: `transId`. Body: any transaction fields to update | `200` with `{ status: "ok", message: "update successfully", content: {...} }`         |
| `/transactions/:transId` | `DELETE` | Auth required. Param: `transId`                                         | `200` with `{ status: "ok", msg: "entry deleted", content: [...] }`                   |

## API Sync

| Endpoint          | Method | Required (params or body) | Expected response                                                                                        |
| ----------------- | ------ | ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `/api/sync24hr`   | `POST` | Body: `coins` optional    | `200` with `{ status: "ok", msg: "All target chart histories synchronized successfully!", syncedCoins }` |
| `/api/sync30days` | `POST` | Body: `coins` optional    | `200` with `{ status: "ok", msg: "All target chart histories synchronized successfully!", syncedCoins }` |
| `/api/syncTop250` | `POST` | None                      | `200` with `{ status: "ok", msg: "All top 250 synchronized successfully!", show: "<n> entries saved" }`  |

## DB Reads

| Endpoint         | Method | Required (params or body) | Expected response                                                                                                     |
| ---------------- | ------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `/db/post24hr`   | `POST` | Body: `id`                | `200` with `{ status: "fetch successfully from Database", show, first_price, latest_price, first_date, latest_date }` |
| `/db/post30days` | `POST` | Body: `id`                | `200` with `{ status: "fetch successfully from Database", show, first_price, latest_price, first_date, latest_date }` |
| `/db/getTop250`  | `GET`  | None                      | `200` with `{ status: "fetch successfully from Database", msg: "<n> entries fetched", show: [...] }`                  |
| `/db/postTop250` | `POST` | Body: `id`                | `200` with `{ status: "fetch successfully from Database", show }`                                                     |

## Notes

- Routes like `/auth/profile`, `/transactions/*`, and `/transactions/seed` require a valid authenticated user.
- `transId` is the transaction document id stored inside the user record.
- `coinType` is often populated with asset data when a matching coin exists.
