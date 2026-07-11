# Phase 1: MongoDB Atlas Setup — KoinSight-Tracker

## Overview

MongoDB Atlas M0 (free tier) cluster set up as the database backend for the MERN stack KoinSight-Tracker project. This replaces the local MongoDB install (previously downgraded to v7.0 due to AVX instruction limitations on Intel 6th-gen hardware — irrelevant once using Atlas, since no local Mongo server is required).

## Steps Completed

### 1. Cluster Creation

- Created Atlas account (personal account, not teammate's — this becomes the portfolio-owned DB instance)
- Created project and M0 (free) cluster named `koinsight-tracker`
- Cloud provider: AWS
- Region: closest to Singapore for lower latency

### 2. Database User

- Username: `koinsight_mongodb`
- Password: set without special characters (`@ # / : ?` etc.) to avoid connection string URL-parsing issues
- Privileges: Read and write to any database

### 3. Network Access (IP Whitelist)

- **Initial mistake**: only added local machine's specific IP address (via Atlas's newer combined "Set up connection security" step)
- **Fix required**: added `0.0.0.0/0` (Allow Access from Anywhere) — necessary because Render's free tier has no static outbound IP
- Note: `0.0.0.0/0` is safe as long as DB password remains strong, since valid credentials are still required to connect

### 4. Connection String

Retrieved via Atlas → Connect → Drivers → Node.js. Atlas's newer UI provides a shortened default string without `retryWrites`/`w=majority` params (fine — modern drivers default to these).

Final format used:

```
mongodb+srv://koinsight_mongodb:<password>@koinsight-tracker.fr4vbqy.mongodb.net/koinsight_db?appName=KoinSight-Tracker
```

Two manual edits required from Atlas's copy-paste default:

- Replaced `<db_password>` placeholder with actual password
- Added explicit database name (`koinsight_db`) before the `?` — without this, Mongoose defaults to creating a database named `test`

## Issues Encountered & Fixes

### Issue 1: `querySrv ECONNREFUSED _mongodb._tcp.koinsight-tracker...`

- **Cause**: Home router's default DNS server failed to resolve the SRV record type required by `mongodb+srv://` connection strings (routers often only handle standard A/AAAA lookups well, not SRV)
- **Fix**: Override DNS servers at the Node.js level, added to the top of `server.js`:

```javascript
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
```

- Alternative (not needed here, but valid): change DNS at OS network settings level, or use Atlas's non-SRV `mongodb://` legacy connection string with explicit host:port list

### Issue 2: `MongooseError: The 'uri' parameter to openUri() must be a string, got "undefined"`

- **Cause**: `dotenv.config()` was not called before `mongoose.connect()`, so `process.env.MONGODB_URI` was undefined at connection time
- **Fix**: Ensure `dotenv` is imported and configured at the very top of `server.js`, before any code that reads `process.env`:

```javascript
import dotenv from "dotenv";
dotenv.config();
```

### Issue 3: Database created as `test` instead of intended name

- **Cause**: Connection string initially lacked an explicit database name; Mongoose defaulted to `test`
- **Fix**: Added `koinsight_db` explicitly into the connection string; old `test` database data will be exported locally (JSON dump) before being dropped, then re-imported into `koinsight_db`

## Verification

- ✅ Backend connects successfully (`✅ MongoDB connected` logged on startup)
- ✅ Confirmed via Bruno: API login/CRUD requests working end-to-end
- ✅ Confirmed via MongoDB Compass: direct connection to Atlas cluster successful
- ✅ Cron job successfully writing live 3rd-party API data (crypto price history) into Atlas on schedule
- ✅ Collections visible in Atlas dashboard (Browse Collections): `crypto_24hr_5m`, `crypto_30days_1hr`, `crypto_top250Coins`, `users`

## Notes for Next Deployment

- Always check the generated password for special characters immediately — regenerate if present
- Always explicitly set the database name in the connection string from the start to avoid ending up with a `test` database
- Keep DNS override snippet handy as a fast diagnostic if SRV lookup errors reappear on a different network
