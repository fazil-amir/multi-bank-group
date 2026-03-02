export const TRACKER_SYMBOLS = [
  "btcusdt",
  "ethusdt",
  "solusdt",
  "bnbusdt",
  "adausdt",
  "xrpusdt",
  "dogeusdt",
  "maticusdt",
  "dotusdt",
  "ltcusdt",
  "avaxusdt",
  "linkusdt",
  "atomusdt",
  "trxusdt",
  "uniusdt",
  "xlmusdt",
  "etcusdt",
  "filusdt",
  "nearusdt",
  "aptusdt",
] as const;

const streamQuery = TRACKER_SYMBOLS.map((s) => `${s}@trade`).join("/");

export const TRACKER_WS_URL = `wss://stream.binance.com:9443/stream?streams=${streamQuery}`;

export const SSE_INTERVAL_MS = 2000;
