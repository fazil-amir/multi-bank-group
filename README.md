# Multi Bank Crypto Dashboard


https://github.com/user-attachments/assets/dd6a0eba-64c1-4ccf-bf78-35df3dc895e5

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-multi--platform-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

Production-ready full-stack crypto price dashboard: live spot prices and historical charts for 14 USDT pairs, cookie-based auth, and real-time updates via Server-Sent Events.

| **Resource** | **Value**  |
|---|---|
| **Live**  | [**https://crypto-dashboard.fazilamir.me/**](https://crypto-dashboard.fazilamir.me/) |
| **Image** | `fazilamir/multi-bank-crypto-dashboard:latest` |

> **Production hosting:** The live app runs on a **self-hosted machine at home** ([Zima OS](https://zimaspace.com/)). It is exposed to the internet via **[Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/)**, so no port forwarding or public IP is required.

---

## Table of contents

- [Quick start](#quick-start)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [API reference](#api-reference)
- [Project structure](#project-structure)
- [Caching](#caching)
- [Security](#security)
- [Current assumptions](#current-assumptions)
- [Future enhancements](#future-enhancements)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Quick start

```bash
git clone <repo-url>
cd multi-bank-crypto-dashboard
npm install
npm run dev
```

- **App:** [http://localhost:5173](http://localhost:5173)  
- **API:** [http://localhost:4000](http://localhost:4000)  

**Demo login:** `alice@example.com` / `password1`

**Docker (one command):**

```bash
docker run -d -p 4000:4000 -e NODE_ENV=production -e SECURE_COOKIE=false \
  --restart unless-stopped \
  fazilamir/multi-bank-crypto-dashboard:latest
```

Then open [http://localhost:4000](http://localhost:4000).

---

## Features

- **Live prices** — 14 crypto/USDT pairs (BTC, ETH, SOL, BNB, ADA, XRP, DOGE, DOT, LTC, AVAX, LINK, ATOM, TRX, UNI, XLM) from Binance
- **Real-time updates** — Single server-side WebSocket to Binance; SSE to clients every 2s
- **Historical charts** — 1D candles, ~1 year of data; Binance klines with server and client caching
- **Auth** — Email/password, JWT in HTTP-only cookie, protected routes
- **Responsive UI** — Tracker grid, sortable price table, per-symbol detail page with TradingView-style chart
- **Multi-platform Docker** — Single image for `linux/amd64` and `linux/arm64` (Zima OS, Raspberry Pi, cloud)

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7 |
| **Charts** | TradingView Lightweight Charts |
| **Backend** | Node 20+, Express, TypeScript (tsx) |
| **Auth** | JWT (jsonwebtoken), bcrypt, HTTP-only cookies |
| **Data** | Binance WebSocket (trades), Binance REST (klines) |
| **Real-time** | Server-Sent Events (SSE) |
| **Test** | Vitest |
| **Quality** | ESLint 9, Prettier |
| **Deploy** | Docker (multi-stage), Docker Hub |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Browser (SPA)                            │
│  React + Vite bundle  │  AuthContext  │  TrackerDataContext      │
│  SSE client (2s)      │  Cookie auth  │  Cache API (history)     │
└──────────────────────────────┬───────────────────────────────────┘
                               │ HTTP/SSE (same origin or CORS)
┌──────────────────────────────▼───────────────────────────────────┐
│                    Express (single process)                      │
│  /api/auth/*  │  /api/trackers/symbols  │  /api/trackers/streams │
│  /api/trackers/:symbol  │  static dist/  │  SPA fallback         │
│  requireAuth middleware on trackers                              │
└──────────────────────────────┬───────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Binance WS    │    │ In-memory price │    │ In-memory       │
│ (trades)      │───▶│ Map (live)      │    │ history cache   │
│ stream.binance│    │                 │    │ (24h TTL)       │
└───────────────┘    └────────┬────────┘    └────────┬────────┘
                              │                      │
                              │ SSE every 2s         │ Binance REST
                              │                      │ (klines)
                              ▼                      ▼
                    ┌─────────────────────────────────────────┐
                    │               Binance API               │
                    │  api.binance.com (klines, 1d, 366)      │
                    └─────────────────────────────────────────┘
```

- **Bootstrap:** Server starts → `connectTracker()` opens Binance WebSocket → price map populated → Express serves API + static. Client loads → `AuthProvider` calls `/api/auth/me` → then either login or protected app with `TrackerDataProvider` (trackers + SSE).

---

## Getting started

### Prerequisites

- **Node.js** ≥ 20  
- **npm** (or pnpm/yarn)

### Local development

```bash
npm install
npm run dev
```

- **Client (HMR):** [http://localhost:5173](http://localhost:5173)  
- **API:** [http://localhost:4000](http://localhost:4000)

### Production build (run locally)

```bash
npm run build
npm start
```

Serves app + API at [http://localhost:4000](http://localhost:4000).

### Docker

| Goal | Command |
|------|--------|
| Build image | `npm run docker:build` |
| Run container | `npm run docker:run` |
| Build + push (multi-platform) | `npm run docker:push` |

### Docker Compose

```bash
docker compose up -d
```

Uses image `fazilamir/multi-bank-crypto-dashboard:latest`, port `4000`, `NODE_ENV=production`, `SECURE_COOKIE=false`.

---

## Configuration

Environment variables (see [.env.example](.env.example)):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server listen port |
| `NODE_ENV` | — | `production` for prod build; affects cookie and behavior |
| `SECURE_COOKIE` | (see below) | Set to `false` when using **HTTP** (e.g. home server) so auth cookie is sent. Omit or `true` for HTTPS. |
| `VITE_API_BASE_URL` | (same-origin in prod) | Override API base URL for the client (e.g. dev proxy). |

**Production (HTTPS):** Use default cookie behavior (secure).  
**Production (HTTP, e.g. home server):** Set `SECURE_COOKIE=false` in the container/compose.

---

## Deployment

### Docker (recommended)

1. **Pull and run:**
   ```bash
   docker pull fazilamir/multi-bank-crypto-dashboard:latest
   docker run -d --name multi-bank-crypto-dashboard \
     -p 4000:4000 \
     -e NODE_ENV=production \
     -e SECURE_COOKIE=false \
     --restart unless-stopped \
     fazilamir/multi-bank-crypto-dashboard:latest
   ```
2. **Or use Compose:** `docker compose up -d` (see [docker-compose.yml](docker-compose.yml)).

### Build and push new image

```bash
docker login
npm run docker:push
```

Builds for `linux/amd64` and `linux/arm64` and pushes to Docker Hub. Redeploy by pulling the updated image and recreating the container.

### Reverse proxy (HTTPS)

Put the app behind nginx, Caddy, or Traefik with HTTPS and optional basic auth. Then either:

- Omit `SECURE_COOKIE` or set `SECURE_COOKIE=true`, or  
- Keep `SECURE_COOKIE=false` if the proxy terminates SSL and talks to the app over HTTP (cookie is still sent to the browser over HTTPS).

---

## API reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/login` | No | Body: `{ email, password }`. Sets HTTP-only cookie, returns `{ user }`. |
| `POST` | `/api/auth/logout` | Cookie | Clears auth cookie. |
| `GET` | `/api/auth/me` | Cookie | Returns `{ user: { email } }` or 401. |
| `GET` | `/api/trackers/symbols` | Cookie | Returns list of tracker configs (id, name, symbol, icon, etc.). |
| `GET` | `/api/trackers/streams` | Cookie | SSE stream; JSON array of live prices every 2s. |
| `GET` | `/api/trackers/:symbol` | Cookie | Historical OHLC for symbol (1D, ~1y). Cached 24h server-side. |

All authenticated routes require the auth cookie (same site or CORS with `credentials: true`).

---

## Project structure

```
multi-bank-crypto-dashboard/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── Dockerfile                 # Multi-stage: build frontend, run Express
├── docker-compose.yml
├── .env.example
├── src/
│   ├── client/                # Frontend
│   │   ├── main.tsx           # React root
│   │   ├── app/App.tsx        # Routes: /login, protected /*
│   │   ├── contexts/          # AuthContext, TrackerDataContext
│   │   ├── pages/             # LoginPage, TrackersPage, TrackerDetailPage
│   │   ├── components/        # ProtectedRoute, tracker-*, ui/table
│   │   ├── hooks/             # useLivePrices (SSE), useHistory, useTrackers
│   │   └── ui/
│   ├── server/                # Express API
│   │   ├── index.ts           # App setup, static, connectTracker()
│   │   ├── routes/            # auth, trackers
│   │   ├── controllers/       # auth, trackers (SSE, history)
│   │   ├── middleware/        # requireAuth
│   │   └── services/          # auth, trackers (WS), history (klines + cache)
│   └── shared/                # Shared by client + server
│       ├── constants/         # app, api, auth, tracker, trackerSymbols
│       ├── types/             # market.types
│       └── utils/             # trackerData.utils
├── scripts/                   # build-package.sh, install-on-zima.sh, etc.
└── docs/                      # zima-os-gui-install.md, etc.
```

---

## Caching

| Layer | What | TTL / behavior |
|-------|------|----------------|
| **Server – live prices** | In-memory `Map` from Binance WebSocket | No TTL; always latest trade. |
| **Server – history** | In-memory cache per symbol | 24h (`HISTORY_CACHE_TTL_MS`). |
| **Client – history** | Browser Cache API (`tracker-history`) | 24h; `X-Cached-At` header used for age. |

---

## Security

- **Auth:** JWT in HTTP-only cookie; `SameSite=Lax`. No token in localStorage.
- **Passwords:** bcrypt (cost 10). Demo users are static; replace with a proper user store and strong secret for production.
- **Production:** Set `JWT_SECRET` via environment (see [auth.constants.ts](src/shared/constants/auth.constants.ts)); do not rely on the default in repo.
- **HTTPS:** Use `SECURE_COOKIE=true` (default when `NODE_ENV=production` and `SECURE_COOKIE` not set) so the cookie is only sent over HTTPS. For HTTP (e.g. home server behind VPN), set `SECURE_COOKIE=false`.
- **CORS:** Configured with `credentials: true`; restrict `origin` in production if needed.

---

## Current assumptions

- **User credentials are static** — No sign-up or user management. Demo users (e.g. `alice@example.com`, `bob@example.com`) are defined in code ([auth.constants.ts](src/shared/constants/auth.constants.ts)); no database.
- **Single process, in-memory only** — No Redis or database. Live price map and history cache live in process memory; restart clears them.
- **Binance WebSocket is always on** — The server opens the Binance trade stream at startup and keeps it open; data is pushed regardless of whether any client is connected.
- **One SSE interval per client** — Each connected client gets its own 2s interval for SSE; at scale this would be replaced by a single shared broadcaster.
- **JWT secret in code (demo)** — Production should use `JWT_SECRET` from environment; default in repo is for development only.
- **No rate limiting** — API endpoints are not rate-limited.
- **No persistent user preferences** — Theme (dark only today), alerts, or watchlists are not stored per user.

---

## Future enhancements

Planned or possible improvements:

| Area | Enhancement |
|------|-------------|
| **Auth & users** | **Sign-up module** — User registration with email verification; move from static users to a real user store. |
| **Storage** | **Mongoose (MongoDB)** — Persist users, sessions, and optionally user preferences (watchlists, alerts). |
| **API protection** | **Rate limiting** — Per-IP or per-user limits on login and API endpoints (e.g. express-rate-limit) to reduce abuse. |
| **Alerts** | **Price alerts per user** — Let users set target prices; notify (in-app, email, or webhook) when price is reached; store in DB. |
| **UI** | **Light mode** — Theme toggle (light/dark/system) with persisted preference. |
| **Caching** | **Redis for history** — Replace in-memory history cache with Redis so multiple instances share cache and survive restarts. |
| **Real-time / WebSocket** | **Smarter Binance connection** — See [WebSocket connection improvements](#websocket-connection-improvements) below. |

### WebSocket connection improvements

- **On-demand or time-window streaming** — Today the server connects to Binance at boot and keeps the stream open 24/7. A possible improvement: connect only when at least one client needs live data, or fetch data for a **defined period** (e.g. market hours / session) instead of indefinitely.
- **Reconnect with backoff** — Robust reconnection logic (exponential backoff, max retries) when the Binance WebSocket drops.
- **Single shared broadcaster** — One timer that pushes the same snapshot to all SSE clients instead of one interval per client.
- **Optional separate worker** — Run the Binance WebSocket in a separate process or worker and communicate via Redis/shared store so the API can scale independently.

---

## Development

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | API + Vite dev server (concurrent) |
| `npm run build` | Vite production build → `dist/` |
| `npm start` | Run Express (serve `dist/` + API) |
| `npm run test` | Vitest once |
| `npm run test:watch` | Vitest watch |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with fix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run container (removes existing same name) |
| `npm run docker:push` | Multi-platform build + push to Docker Hub |

### Data flow (summary)

1. **Auth:** Login → POST `/api/auth/login` → cookie set → `AuthContext` holds user. `requireAuth` reads cookie and verifies JWT.
2. **Trackers:** `useTrackers()` → GET `/api/trackers/symbols` → list of symbols/config.
3. **Live prices:** Server: Binance WS → in-memory map. SSE handler sends snapshot every 2s. Client: `useLivePrices()` subscribes to SSE, buffers, flushes every 2s, computes trends.
4. **History:** GET `/api/trackers/:symbol` → server cache or Binance klines → client caches in Cache API (24h).

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| **401 Unauthorized** on APIs after login | Using HTTP? Set `SECURE_COOKIE=false` so the auth cookie is sent. Rebuild/redeploy so the server uses it. |
| **No matching manifest for linux/amd64** | Image was built on arm64 only. Use `npm run docker:push` to build and push multi-platform image. |
| **Push access denied** to Docker Hub | Run `docker login`. Tag image as `yourusername/repo:tag` (e.g. `fazilamir/multi-bank-crypto-dashboard:latest`) before push. |
| **Blank page at localhost:4000** | Ensure `dist/` exists (`npm run build`) and server serves it; or run in Docker so the image includes the built frontend. |
| **SSE / prices not updating** | Check server logs; ensure Binance WebSocket is connected and `/api/trackers/streams` is reachable with auth cookie. |

---

## License

Private / unlicensed unless stated otherwise.
