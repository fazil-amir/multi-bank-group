import { TRACKERS } from "./tracker-symbols.constants";

export const TRACKER_SYMBOLS = TRACKERS.map((t) => t.id);

const streamQuery = TRACKER_SYMBOLS.map((s) => `${s}@trade`).join("/");

export const TRACKER_WS_URL = `wss://stream.binance.com:9443/stream?streams=${streamQuery}`;

export const SSE_INTERVAL_MS = 2000;
