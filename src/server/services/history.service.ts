import {
  BINANCE_KLINES_BASE,
  HISTORY_CACHE_TTL_MS,
  HISTORY_INTERVAL,
  HISTORY_LIMIT,
  TRACKER_SYMBOLS,
} from "@shared/constants/tracker.constants";
import type { PriceHistoryPoint } from "@shared/types/market.types";
import {
  buildKlinesUrl,
  parseKlinesToHistory,
} from "@shared/utils/trackerData.utils";

interface CachedHistory {
  data: PriceHistoryPoint[];
  fetchedAt: number;
}

const historyCache = new Map<string, CachedHistory>();

function isHistoryCacheValid(entry: CachedHistory): boolean {
  return Date.now() - entry.fetchedAt < HISTORY_CACHE_TTL_MS;
}

async function fetchHistoryFromBinance(
  symbol: string,
): Promise<PriceHistoryPoint[]> {
  const url = buildKlinesUrl(
    BINANCE_KLINES_BASE,
    symbol,
    HISTORY_INTERVAL,
    HISTORY_LIMIT,
  );
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Binance klines failed: ${res.status}`);
  }
  const rows = (await res.json()) as (string | number)[][];
  return parseKlinesToHistory(rows);
}

export async function getTrackerHistory(
  symbol: string,
): Promise<PriceHistoryPoint[]> {
  const key = symbol.toUpperCase();
  const existing = historyCache.get(key);
  if (existing && isHistoryCacheValid(existing)) {
    return existing.data;
  }
  const data = await fetchHistoryFromBinance(key);
  historyCache.set(key, { data, fetchedAt: Date.now() });
  return data;
}

export function isKnownSymbol(symbol: string): boolean {
  const upper = symbol.toUpperCase();
  return TRACKER_SYMBOLS.some((id) => id.toUpperCase() === upper);
}
