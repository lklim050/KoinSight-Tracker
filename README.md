# KOIN-SIGHT TRACKER - YOUR ULTIMATE CRYPTO PORTFOLIO COMPANION

Welcome to the Koin-Sight Tracker repository! This project is designed to help cryptocurrency investors track their portfolios, analyze market trends, and make informed decisions. With real-time data integration and a user-friendly interface, Koin-Sight Tracker provides a comprehensive solution for managing your crypto assets effectively.

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Components](#components)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Transactions](#transactions)
  - [Portfolio History](#portfolio-history)
  - [API Sync](#api-sync)
  - [Database Reads](#database-reads)
- [Database Schema](#database-schema)
  - [User Collection](#user-collection)
  - [Embedded Transaction Subdocument](#embedded-transaction-subdocument)
  - [Asset Collection](#asset-collection)
  - [Standalone Transaction Collection](#standalone-transaction-collection)
  - [Cached Top 250 Coins Collection](#cached-top-250-coins-collection)
  - [24 Hour History Collection](#24-hour-history-collection)
  - [30 Day History Collection](#30-day-history-collection)

## About the Project

Koin-Sight Tracker is a powerful tool for cryptocurrency investors, offering features such as real-time portfolio tracking, transaction management, and historical performance analysis. The project is built using Node.js and Express for the backend, with MongoDB as the database to store user data and transaction history. The API is designed to be secure and efficient, allowing users to easily manage their crypto assets and stay informed about market trends.

## Key Features

- User authentication with JWT tokens
- CRUD operations for transactions
- Real-time portfolio tracking visualized by charts
- Real-time data integration with CoinGecko API for market prices and historical data
- Responsive design for nice user experience.

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
PORT=[your selected port for listen]
DATABASE=[your database URI]
JWT_SECRET=[your own generated string]
VITE_SERVER=http:[your localhost or IP with the port you are listening to your backend]
```

## API Documentation

The backend routes are mounted from `backend/server.js` and organized by feature. Authenticated routes require a Bearer token in the `Authorization` header.

### Authentication

- Authentication uses JWT tokens returned from `/auth/login`.

| Endpoint        | Method | Auth | Body                            | Response                                                       |
| --------------- | ------ | ---- | ------------------------------- | -------------------------------------------------------------- |
| `/auth/signup`  | `POST` | No   | `username`, `email`, `password` | `201` with `{ message, user: { id, username, email } }`        |
| `/auth/login`   | `POST` | No   | `email`, `password`             | `200` with `{ message, token, user: { id, username, email } }` |
| `/auth/profile` | `GET`  | Yes  | None                            | `200` with `{ message: "Protected route accessed", user }`     |

### Assets

| Endpoint        | Method | Auth | Body | Response                                           |
| --------------- | ------ | ---- | ---- | -------------------------------------------------- |
| `/assets/read`  | `GET`  | No   | None | Returns all asset documents                        |
| `/assets/seed`  | `GET`  | No   | None | Seeds the asset collection                         |
| `/assets`       | `GET`  | Yes  | None | Returns calculated holdings for the logged-in user |
| `/assets/all`   | `GET`  | Yes  | None | Returns portfolio summary data                     |
| `/assets/chart` | `GET`  | Yes  | None | Returns the user portfolio timeline for charting   |

### Transactions

| Endpoint                 | Method   | Auth | Body / Params                                                                       | Response                                         |
| ------------------------ | -------- | ---- | ----------------------------------------------------------------------------------- | ------------------------------------------------ |
| `/transactions/seed`     | `GET`    | Yes  | None                                                                                | Seeds test transactions for the current user     |
| `/transactions`          | `GET`    | Yes  | None                                                                                | Returns all transactions for the current user    |
| `/transactions`          | `PUT`    | Yes  | `transType`, `coinType`, `quantity`, `pricePerCoin`, `fee`, `notes`, `date`, `time` | Creates a transaction and returns the new record |
| `/transactions/:transId` | `POST`   | Yes  | `transId`                                                                           | Returns a single transaction entry               |
| `/transactions/:transId` | `PATCH`  | Yes  | `transId` plus any fields to update                                                 | Updates the matching transaction entry           |
| `/transactions/:transId` | `DELETE` | Yes  | `transId`                                                                           | Deletes the matching transaction entry           |

### API Sync

| Endpoint          | Method | Auth | Body                   | Response                                   |
| ----------------- | ------ | ---- | ---------------------- | ------------------------------------------ |
| `/api/sync24hr`   | `POST` | No   | Optional `coins` array | Syncs 24 hour price history from CoinGecko |
| `/api/sync30days` | `POST` | No   | Optional `coins` array | Syncs 30 day price history from CoinGecko  |
| `/api/syncTop250` | `POST` | No   | None                   | Syncs the top 250 coins from CoinGecko     |

### Database Reads

| Endpoint         | Method | Auth | Body | Response                                  |
| ---------------- | ------ | ---- | ---- | ----------------------------------------- |
| `/db/post24hr`   | `POST` | No   | `id` | Returns a single 24 hour history document |
| `/db/post30days` | `POST` | No   | `id` | Returns a single 30 day history document  |
| `/db/getTop250`  | `GET`  | No   | None | Returns all top 250 coin documents        |
| `/db/postTop250` | `POST` | No   | `id` | Returns one top 250 coin document         |

## Database Schema

MongoDB stores both user data and cached CoinGecko data. The current app uses embedded transactions inside the user document for the main portfolio flow, and it also defines a separate transaction collection model in `backend/src/models/Portofoilo/Transactions.js`.

- The current portfolio flow relies on embedded user transactions, while the standalone `transactions` collection exists as a separate model definition.

### User Collection

Collection: `users`

| Field                     | Type     | Notes                             |
| ------------------------- | -------- | --------------------------------- |
| `username`                | `String` | Required, trimmed                 |
| `email`                   | `String` | Required, unique, trimmed         |
| `password`                | `String` | Required, stored as a bcrypt hash |
| `transactions`            | `Array`  | Embedded transaction subdocuments |
| `createdAt` / `updatedAt` | `Date`   | Added by Mongoose timestamps      |

### Embedded Transaction Subdocument

Used inside `User.transactions`.

| Field          | Type     | Notes                                            |
| -------------- | -------- | ------------------------------------------------ |
| `transType`    | `String` | Required, typically `buy`, `sell`, or `transfer` |
| `coinType`     | `String` | Required, CoinGecko coin id or asset reference   |
| `quantity`     | `Number` | Required                                         |
| `pricePerCoin` | `Number` | Defaults to `0` in the embedded schema           |
| `fee`          | `Number` | Optional                                         |
| `notes`        | `String` | Optional, max 200 characters                     |
| `date`         | `Date`   | Required                                         |
| `time`         | `String` | Required                                         |
| `created_at`   | `Date`   | Defaults to now                                  |

### Asset Collection

Collection: `assets`

| Field                     | Type     | Notes                                |
| ------------------------- | -------- | ------------------------------------ |
| `_id`                     | `String` | CoinGecko coin id, such as `bitcoin` |
| `id`                      | `String` | Required, unique                     |
| `symbol`                  | `String` | Required, stored uppercase           |
| `name`                    | `String` | Required                             |
| `image`                   | `String` | Required                             |
| `current_price`           | `Number` | Required                             |
| `market_cap_rank`         | `Number` | Required, indexed                    |
| `createdAt` / `updatedAt` | `Date`   | Added by Mongoose timestamps         |

### Standalone Transaction Collection

Collection: `transactions`

| Field          | Type       | Notes                        |
| -------------- | ---------- | ---------------------------- |
| `userId`       | `ObjectId` | References `User`            |
| `transType`    | `String`   | Required                     |
| `coinType`     | `String`   | Required, references `Asset` |
| `quantity`     | `Number`   | Required                     |
| `pricePerCoin` | `Number`   | Required                     |
| `fee`          | `Number`   | Optional                     |
| `notes`        | `String`   | Optional, max 200 characters |
| `date`         | `Date`     | Required                     |
| `time`         | `String`   | Required                     |
| `created_at`   | `Date`     | Defaults to now              |

### Cached Top 250 Coins Collection

Collection: `crypto_top250Coins`

| Field                                     | Type     | Notes             |
| ----------------------------------------- | -------- | ----------------- |
| `_id`                                     | `String` | CoinGecko coin id |
| `symbol`                                  | `String` | Required          |
| `name`                                    | `String` | Required          |
| `image`                                   | `String` | Required          |
| `current_price`                           | `Number` | Required          |
| `market_cap`                              | `Number` | Required          |
| `market_cap_rank`                         | `Number` | Required          |
| `fully_diluted_valuation`                 | `Number` | Required          |
| `total_volume`                            | `Number` | Required          |
| `high_24h`                                | `Number` | Defaults to `0`   |
| `low_24h`                                 | `Number` | Defaults to `0`   |
| `price_change_24h`                        | `Number` | Defaults to `0`   |
| `price_change_percentage_24h`             | `Number` | Defaults to `0`   |
| `market_cap_change_24h`                   | `Number` | Defaults to `0`   |
| `market_cap_change_percentage_24h`        | `Number` | Defaults to `0`   |
| `last_updated`                            | `Date`   | Required          |
| `price_change_percentage_1h_in_currency`  | `Number` | Defaults to `0`   |
| `price_change_percentage_24h_in_currency` | `Number` | Defaults to `0`   |
| `price_change_percentage_7d_in_currency`  | `Number` | Defaults to `0`   |

### 24 Hour History Collection

Collection: `crypto_24hr_5m`

| Field           | Type     | Notes                                                                 |
| --------------- | -------- | --------------------------------------------------------------------- |
| `_id`           | `String` | CoinGecko coin id                                                     |
| `last_fetched`  | `Date`   | Defaults to now                                                       |
| `price_history` | `Array`  | Array of `{ timestamp, price }` records at roughly 5 minute intervals |

### 30 Day History Collection

Collection: `crypto_30days_1hr`

| Field           | Type     | Notes                                                               |
| --------------- | -------- | ------------------------------------------------------------------- |
| `_id`           | `String` | CoinGecko coin id                                                   |
| `last_fetched`  | `Date`   | Defaults to now                                                     |
| `price_history` | `Array`  | Array of `{ timestamp, price }` records at roughly 1 hour intervals |
