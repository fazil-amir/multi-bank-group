import { TRACKERS } from "./trackerSymbols.constants";

export const TRACKER_SYMBOLS = TRACKERS.map((t) => t.id);

const streamQuery = TRACKER_SYMBOLS.map((s) => `${s}@trade`).join("/");

export const TRACKER_WS_URL = `wss://stream.binance.com:9443/stream?streams=${streamQuery}`;

export const SSE_INTERVAL_MS = 2000;

export const BINANCE_KLINES_BASE = "https://api.binance.com/api/v3/klines";
export const HISTORY_INTERVAL = "1d";
export const HISTORY_LIMIT = 366;
/** Cache TTL: 24h so each day we serve fresh 1y history. */
export const HISTORY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
