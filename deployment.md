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

---

# Phase 2: Render (Backend) Setup — KoinSight-Tracker

## Overview

Deployed the Express/Node.js backend as a Render Web Service. Original repo (`ericistan/KoinSight-Tracker`) is owned by a teammate; despite being a confirmed GitHub Collaborator, the repo did not appear in Render's repo picker (likely a stale OAuth scope from initial Render↔GitHub authorization). Resolved by **forking the repo to a personal account** (`lklim050/KoinSight-Tracker`) and deploying from the fork instead.

## Repo Access Troubleshooting (for reference)

Attempted in order before settling on fork:

1. Confirmed collaborator status directly on GitHub (Settings → Collaborators and teams) — confirmed listed
2. Confirmed repo is personal-owned (`ericistan/...`), not an organization — ruled out org-level third-party access restrictions
3. Checked Render's GitHub App install settings (github.com/settings/installations → Render → Configure) — set to "All repositories," yet repo still not selectable
4. Considered disconnecting/reconnecting Render's GitHub credential to force a re-sync — **not attempted**, since it risked disrupting other already-connected Render services tied to the same GitHub credential
5. **Resolution: forked the repo** — cleanest option given time constraints and to avoid risk to existing services

## Steps Completed

1. Forked `ericistan/KoinSight-Tracker` → `lklim050/KoinSight-Tracker` (main branch only)
2. Cloned fork locally for any further changes: `git clone https://github.com/lklim050/KoinSight-Tracker.git`
3. Created Render account, New + → Web Service → selected `lklim050/KoinSight-Tracker` (showed up immediately, no permission issues since fork is personally owned)
4. Configured service:
   - Root Directory: `backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js` (adjust if using `npm start`)
   - Instance Type: Free
5. Added environment variables:
   - `MONGODB_URI` — Atlas connection string
   - `FRONTEND_URL` — placeholder initially, updated after Netlify deploy (Phase 3)
   - other API keys (3rd-party crypto price API used by cron job, JWT secret, etc.)
6. Deployed — confirmed `✅ MongoDB connected` and server startup in logs
7. Verified via Bruno — API endpoints responding correctly against the live Render-hosted backend
8. Local frontend pointed temporarily at the Render backend URL (instead of local backend) to confirm real frontend↔Render connectivity before deploying to Netlify — passed, no CORS errors

## ⚠️ Known Limitation: Render Free Tier Spin-Down vs Cron Job

- Render's free Web Service spins down after **15 minutes of inactivity** (no inbound HTTP/WebSocket traffic) and takes ~30–60s to cold-start on the next request
- The in-app cron job (`node-cron`, running inside the Express process) **stops entirely while the service is spun down** — this causes gaps in scheduled data collection (e.g. `crypto_24hr_5m` price history) during idle periods, since the cron only fires while the process is alive
- **Considered but not implemented**: using an external uptime pinger (e.g. UptimeRobot) to keep the service awake 24/7. Rejected because Render's free tier only grants **750 instance hours/month** — pinging continuously would consume ~720–744 hours/month, risking suspension of the entire service before month-end
- **Decision**: accepted the cron gaps as a reasonable tradeoff for a portfolio project rather than risking full service suspension

## Verification

- ✅ Render deploy logs show successful MongoDB connection
- ✅ Backend live URL responds correctly
- ✅ Bruno end-to-end API tests pass against deployed backend
- ✅ Local frontend successfully connects to live Render backend (pre-Netlify sanity check)

---

# Phase 3: Netlify (Frontend) Setup — KoinSight-Tracker

## Overview

Deployed the React (Vite) frontend as a Netlify static site, sourced from the same fork (`lklim050/KoinSight-Tracker`) used for Render.

## Steps Completed

1. Netlify → Add new site → Import an existing project → selected `lklim050/KoinSight-Tracker`
2. Configured build settings:
   - Base directory: `frontend`
   - Build Command: `npm run build`
   - Publish directory: `frontend/dist` (Vite)
3. Added environment variable: `VITE_API_URL` (or equivalent) set to the live Render backend URL
4. Deployed — received live Netlify URL (`koinsight-tracker.netlify.app`)
5. Updated Render's `FRONTEND_URL` env var to the live Netlify URL → triggered Render redeploy so CORS allows the deployed frontend
6. Confirmed Express CORS config reads from `process.env.FRONTEND_URL` with a local-dev fallback:
   ```javascript
   app.use(
     cors({
       origin: process.env.FRONTEND_URL || "http://localhost:5173",
     }),
   );
   ```

## Issues Encountered & Fixes

### Issue 1: Landing page images 404 in production (worked fine locally)

- **Cause**: Images referenced via literal string paths (`src="../src/assets/image.jpg"`) instead of JS `import` statements. Vite's dev server can resolve these loosely at runtime, but `npm run build` only bundles assets it can statically detect via `import` — string paths into `src/` are invisible to the build and get shipped broken.
- **Fix**: Converted all affected `<img src="...">` references in `LandingPage.jsx` and `LandingPageFeatureComponent.jsx` from string paths to proper imports:
  ```javascript
  import portfolioImg from "../assets/koinsight-portfolio-page.jpg";
  // ...
  <img src={portfolioImg} ... />
  ```
- **Rule of thumb going forward**: images in `src/assets/` → always `import`; images in `public/` → reference as absolute string path (`/logo.png`), no import needed.

### Issue 2: Direct navigation/refresh on non-root routes (e.g. `/portfolio`) returns Netlify "Page not found"

- **Cause**: Client-side routing (`react-router-dom`) only works after the JS bundle loads and takes over. A direct browser request to a route like `/portfolio` hits Netlify's server looking for a real file/folder at that path, finds none, returns 404.
- **Fix**: Added `frontend/public/_redirects` with:
  ```
  /*    /index.html   200
  ```
  This tells Netlify to serve `index.html` for any unmatched path, letting React Router handle routing client-side. (Equivalent config also possible via `netlify.toml` `[[redirects]]` block — only one method needed, not both.)
- Same root cause and fix as encountered previously on the AOInsights project.

## Verification

- ✅ Live Netlify site loads and renders correctly
- ✅ All landing page images load (post-import-fix)
- ✅ Direct navigation/refresh on internal routes works (post-`_redirects` fix)
- ✅ Frontend successfully calls Render backend with no CORS errors
- ✅ Core flows (login, portfolio data, etc.) functional end-to-end on live URLs

## Known Notes / Follow-ups

- Repo deployed is a **fork**, not the original team repo. If teammates push further commits to `ericistan/KoinSight-Tracker`, they will **not** automatically sync to the fork or trigger redeploys — would need manual `git fetch upstream && git merge upstream/main && git push origin main` from the fork owner's local clone.
- Render free tier cold starts (~30–60s) will be visible on first load after 15 min of inactivity — expected behavior, not a bug, worth mentioning if demoing live during an interview.
- Cron-based price history may have gaps corresponding to Render idle/spin-down periods (see Phase 2 known limitation).
