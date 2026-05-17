# External Integrations

**Analysis Date:** 2026-05-17

## APIs & External Services

**Custom Backend REST API:**
- Used for songs, notifications, skills, certifications, and blogs data
- SDK/Client: `axios` — configured in `src/Utility/Axios/axios.js`
- Base URL: `process.env.REACT_APP_URL` (runtime env var)
- Auth: hardcoded bcrypt hash in `Authorization` header inside `src/Utility/Axios/axios.js` — **not token-based at runtime**
- Endpoints consumed:
  - `GET /songs` — music track list (`src/App.js`)
  - `GET /notifications` — notification data (`src/App.js`)
  - `GET /static/skills` — skills data (`src/App.js`)
  - `GET /static/certifications` — certifications list (`src/App.js`)
  - `GET /blogs` — blog post listing (`src/Pages/Blog.js`)

**YouTube Data (RSS Feed):**
- Used to fetch latest video listing for the terminal page
- Endpoint: `https://www.youtube.com/feeds/videos.xml?channel_id={youtube_id}`
- Channel ID stored in `src/Data/main.json` under key `youtube_id`
- Client: bare `axios` (not the custom instance) in `src/Pages/Terminal.js`
- Note: This call sets `Access-Control-Allow-Origin: *` as a request header (ineffective — CORS is a server-side concern)

## Data Storage

**Databases:**
- None detected — no direct DB client in the frontend

**Static JSON Data:**
- `src/Data/main.json` — portfolio content (name, bio, education, skills, projects, socials, etc.)
- `src/Data/music.json` — local fallback music track list

**Browser Storage:**
- `localStorage` used for:
  - `"color-theme"` — persists dark/light mode preference (`src/App.js`, `src/Components/Menu.js`, `src/Components/Nav.js`, `public/index.html`)
  - `"lastlogin"` — referenced/removed in lock screen keyboard shortcut (`src/App.js`)

**File Storage:**
- AWS S3 — two buckets used as CDN for static assets:
  - `rs-bucket-s3.s3.ap-south-1.amazonaws.com` — music MP3 files, skill icons
  - `aaruush22-bucket.s3.ap-south-1.amazonaws.com` — images, globe texture, profile photo
- Access is public (no auth tokens); URLs hardcoded in `src/Data/main.json` and `src/Data/music.json`
- Custom cursor image also served from S3 (`tailwind.config.js`)

**Caching:**
- None — no service worker, no cache layer detected

## Authentication & Identity

**Auth Provider:**
- Custom / none — the lock screen (`src/Pages/Lock.js`) is a UI lock, not a real auth gate
- The backend API uses a hardcoded bcrypt hash as a static Authorization token in `src/Utility/Axios/axios.js`
- No OAuth, JWT, session cookies, or identity provider detected

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, Datadog, etc.)

**Web Vitals:**
- `web-vitals` 2.1.4 is installed; `src/reportWebVitals.js` is wired to `src/index.js` but no reporting endpoint is configured (metrics are discarded unless a callback is provided)

**Logs:**
- `console.log` is suppressed at app entry: `console.log = function () {};` in `src/index.js`
- Debug `console.log` statements remain in component files (not stripped at build by default)

## CI/CD & Deployment

**Hosting:**
- Not specified in the repository; build output is a standard CRA static bundle (`npm run build`)
- Assets referenced from AWS S3 (ap-south-1 region)

**CI Pipeline:**
- None detected (no GitHub Actions, CircleCI, etc. config files in repo root)

## Environment Configuration

**Required env vars:**
- `REACT_APP_URL` — base URL of the backend REST API (used in `src/Utility/Axios/axios.js`)

**Secrets location:**
- No `.env` file present in the repo
- The Authorization header value in `src/Utility/Axios/axios.js` is a hardcoded bcrypt hash (not a secret per se, but is a static credential embedded in source code)

**Runtime env injection:**
- `public/env.js` is loaded as a script in `public/index.html` and exposes `window.env = {}`
- `react-dotenv` package is installed to support this pattern but the file is currently empty

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Third-Party Scripts (CDN)

Loaded directly in `public/index.html`:
- jQuery 3.6.3 — `https://code.jquery.com/jquery-3.6.3.js`
- pdf.js worker 2.16.105 — `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.js`
- Flowbite bundle — `../node_modules/flowbite/dist/flowbite.bundle.js` (relative path from `public/` — will break in production builds)

---

*Integration audit: 2026-05-17*
