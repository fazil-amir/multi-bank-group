# MultiBank Crypto Dashboard

A full-stack crypto price dashboard that shows live spot prices and historical charts for multiple USDT pairs, with cookie-based auth and real-time updates via Server-Sent Events (SSE).

**Live app:** [https://crypto-dashboard.fazilamir.me/](https://crypto-dashboard.fazilamir.me/)

---

## What This App Does

- **Live prices** for 14 crypto/USDT pairs (BTC, ETH, SOL, BNB, ADA, XRP, DOGE, DOT, LTC, AVAX, LINK, ATOM, TRX, UNI, XLM) from Binance.
- **Real-time updates** via a single WebSocket to Binance on the server, then SSE to the browser every 2 seconds.
- **Historical charts** (1-day candles, up to ~1 year) from Binance klines, with server- and client-side caching.
- **Auth** via email/password (demo users), JWT in HTTP-only cookie, and protected routes.
- **Responsive UI** with a tracker grid, price table, and per-tracker detail page with chart and dropdown.

---

## Tools & Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7 |
| **Charts** | TradingView Lightweight Charts |
| **Backend** | Node 20+, Express, TypeScript (tsx) |
| **Auth** | JWT (jsonwebtoken), bcrypt, HTTP-only cookies |
| **Data** | Binance WebSocket (trades), Binance REST (klines) |
| **Real-time to client** | Server-Sent Events (SSE) |
| **Testing** | Vitest |
| **Lint / format** | ESLint 9, Prettier |
| **Deploy** | Docker (multi-stage), Docker Hub; runs on Zima OS / any host |

---

## How to Run

### Prerequisites

- **Node.js** ≥ 20
- **npm** (or compatible package manager)

### Local development

```bash
# Install dependencies
npm install

# Run API server + Vite dev server (concurrent)
npm run dev
```

- **Client:** [http://localhost:5173](http://localhost:5173) (Vite HMR)
- **API:** [http://localhost:4000](http://localhost:4000)

Demo logins (see [auth constants](src/shared/constants/auth.constants.ts)):  
`alice@example.com` / `password1`, `bob@example.com` / `password2`, `carol@example.com` / `password3`.

### Production build (local)

```bash
npm run build    # Vite build → dist/
npm start        # Express serves dist/ and API on port 4000
```

Open [http://localhost:4000](http://localhost:4000).

### Docker (local)

```bash
npm run docker:build   # Build image
npm run docker:run     # Run container (port 4000)
```

### Docker (push to Docker Hub, multi-platform)

```bash
docker login
npm run docker:push    # Builds linux/amd64 + linux/arm64 and pushes to Docker Hub
```

Image: `fazilamir/multi-bank-crypto-dashboard:latest`.

### Docker Compose

```bash
docker compose up -d
```

Uses `fazilamir/multi-bank-crypto-dashboard:latest` and sets `NODE_ENV=production` and `SECURE_COOKIE=false` for HTTP (e.g. home server). Open [http://localhost:4000](http://localhost:4000) (or your host’s IP).

### Other scripts

| Script | Description |
|--------|-------------|
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Vitest watch |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |

---

## Caching

- **Server – live prices:** In-memory `Map` updated by a single Binance WebSocket; no TTL (always latest trade).
- **Server – history:** In-memory cache per symbol; TTL **24 hours** (`HISTORY_CACHE_TTL_MS`). After TTL, next request refetches from Binance klines.
- **Client – history:** Browser [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) (`tracker-history`). Responses cached with `X-Cached-At`; client checks age and invalidates after **24 hours** so daily data stays fresh.

---

## How the App Bootstraps

1. **Build (Docker):** Multi-stage Dockerfile: stage 1 runs `npm ci` and `npm run build` (Vite) to produce `dist/`; stage 2 runs Express with `dist/` and `src/` (server + shared), and `tsx src/server/index.ts` as `npm start`.
2. **Server startup:** Express loads, mounts CORS, JSON, cookie-parser, auth routes, tracker routes (with `requireAuth`), then static `dist/` and SPA fallback. It starts a single **Binance WebSocket** (`connectTracker()`) to fill the in-memory price map before any client connects.
3. **Client load:** Browser gets `index.html` from Express, loads the Vite bundle. React tree: `StrictMode` → `BrowserRouter` → `AuthProvider` → `App`. `AuthProvider` calls `/api/auth/me` (with credentials) to restore session; then routing shows either `LoginPage` or protected layout with `TrackerDataProvider` and pages.

---

## Project Structure

```
multibank-crypto-dashboard/
├── index.html                 # Entry HTML; script points to /src/client/main.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
├── Dockerfile                # Multi-stage: build frontend, run Express + tsx
├── docker-compose.yml        # Pulls image, port 4000, SECURE_COOKIE=false
├── .env.example
├── src/
│   ├── client/               # Frontend (Vite)
│   │   ├── main.tsx          # React root: StrictMode, BrowserRouter, AuthProvider, App
│   │   ├── styles.css        # Tailwind entry
│   │   ├── app/
│   │   │   ├── App.tsx       # Routes: /login, protected /* (header + TrackerDataProvider + sub-routes)
│   │   │   └── index.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx    # user, login, logout, checkAuth via /api/auth/*
│   │   │   └── TrackerDataContext.tsx  # trackers + priceMap from useTrackers + useLivePrices
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── TrackersPage.tsx   # Grid + table of trackers/prices
│   │   │   └── TrackerDetailPage.tsx  # Chart + dropdown + card for selected symbol
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── tracker-card/      # TrackerCard, TrackerCardShimmer, ChangeBadge, PriceTrailing
│   │   │   ├── tracker-chart/     # TrackerChart (Lightweight Charts)
│   │   │   ├── tracker-table/     # TrackerTable, TableShimmer
│   │   │   ├── tracker-grid/      # TrackerGrid
│   │   │   └── tracker-dropdown/   # TrackerDropdown, TrackerOption
│   │   ├── hooks/
│   │   │   ├── useLivePrices.ts   # SSE to /api/trackers/streams, 2s flush, trend computation
│   │   │   ├── useHistory.ts      # Fetch + Cache API for /api/trackers/:symbol
│   │   │   └── useTrackers.ts     # GET /api/trackers/symbols
│   │   └── ui/
│   │       └── table/             # Table, TableRow, types
│   ├── server/               # Express API
│   │   ├── index.ts          # App setup, CORS, auth + tracker routes, static + SPA, connectTracker(), listen
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── trackers.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts   # login, logout, me; cookie options (SECURE_COOKIE for HTTP)
│   │   │   └── trackers.controller.ts  # symbols, SSE stream, history
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts   # requireAuth: cookie JWT → 401 or next()
│   │   └── services/
│   │       ├── auth.service.ts      # JWT sign/verify, bcrypt, static users
│   │       ├── trackers.service.ts  # Binance WebSocket, in-memory price map
│   │       └── history.service.ts   # Binance klines, in-memory cache 24h
│   └── shared/               # Used by both client and server
│       ├── constants/
│       │   ├── app.constants.ts
│       │   ├── api.constants.ts     # ENDPOINTS
│       │   ├── auth.constants.ts    # JWT, cookie name, static users, demo hint
│       │   ├── tracker.constants.ts # WS URL, SSE interval, klines base, cache TTL, Cache API name
│       │   └── trackerSymbols.constants.ts  # TRACKERS (id, symbol, name, icon, etc.)
│       ├── types/
│       │   └── market.types.ts      # LivePrice, PriceMap, PriceHistoryPoint, TrackerInfo, etc.
│       └── utils/
│           └── trackerData.utils.ts # buildKlinesUrl, parseKlinesToHistory, tradeToLivePrice
├── scripts/                  # Optional: build-package.sh, install-on-zima.sh, push-to-registry.sh
└── docs/                     # e.g. zima-os-gui-install.md
```

---

## Philosophy

- **Single process, in-memory:** One Node process holds the Binance WebSocket and the price map; SSE fans out to clients. No Redis or DB required for the demo.
- **Shared types and constants:** `src/shared` keeps client and server in sync (API paths, tracker list, cache keys, types).
- **Cookie-based auth:** JWT in HTTP-only cookie; `SECURE_COOKIE` can be turned off for HTTP (e.g. home server) so login works without HTTPS.
- **Cache where it helps:** Server caches history 24h to avoid hammering Binance; client caches history in the Cache API with the same TTL for repeat visits and symbol switches.
- **Portable image:** Docker image is multi-platform (amd64/arm64) so the same tag runs on x86 home servers (e.g. Zima OS) and ARM devices.

---

## Pages & Main Components

| Page / Area | Purpose |
|-------------|---------|
| **Login** (`/login`) | Email/password form; redirects to `/` or `from` after success; shows demo hint. |
| **Trackers** (`/`) | Header (app name, user email, Sign out). Tracker grid (cards with live price, change, icon). Price table (all symbols, sortable). |
| **Tracker detail** (`/trackers/:id`) | Dropdown to switch symbol; large chart (Lightweight Charts); card for current symbol; history from `useHistory(symbol)` with client cache. |

**Components:** `ProtectedRoute` (redirects to `/login` if not authenticated), `TrackerCard` / `TrackerCardShimmer`, `TrackerChart`, `TrackerTable` / `TableShimmer`, `TrackerGrid`, `TrackerDropdown` / `TrackerOption`, `ChangeBadge`, `PriceTrailing`, shared `Table` / `TableRow`.

---

## Data Flow

1. **Auth:** User submits login → POST `/api/auth/login` → server validates, sets HTTP-only cookie, returns user → client stores user in `AuthContext`. Later requests send cookie; `requireAuth` verifies JWT and attaches `req.user`.
2. **Tracker list:** Client mounts `TrackerDataProvider` → `useTrackers()` GET `/api/trackers/symbols` → list of trackers (id, name, symbol, icon, etc.).
3. **Live prices:** Server maintains one Binance WebSocket; trades update an in-memory `Map`. SSE handler runs every `SSE_INTERVAL_MS` (2s), sends `getLivePrices()` as JSON. Client `useLivePrices()` subscribes to SSE, buffers updates, flushes every 2s and computes trends (up/down/unchanged) for each field.
4. **History:** Client `useHistory(symbol)` requests GET `/api/trackers/:symbol`. Server `getTrackerHistory(symbol)` uses in-memory cache (24h TTL) or fetches Binance klines, then returns points. Client caches response in Cache API with 24h TTL and reuses until expired.

---

## Environment

See [.env.example](.env.example). Notable:

- `PORT` – server port (default 4000).
- `NODE_ENV=production` – enables production behavior (e.g. cookie secure when `SECURE_COOKIE` is not disabled).
- `SECURE_COOKIE=false` – allow auth cookie over HTTP (e.g. Docker on home server).
- `VITE_API_BASE_URL` – optional; in production build the client uses same-origin if not set.

---

## License

Private / unlicensed unless stated otherwise.
