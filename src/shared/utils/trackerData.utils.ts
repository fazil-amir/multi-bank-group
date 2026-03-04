import type {
  LivePrice,
  PriceHistoryPoint,
  TradeEvent,
  TrackerInfo,
} from "@shared/types/market.types";

// --- History (klines) ---

/** Binance klines row: [openTime, open, high, low, close, volume, ...] */
export type KlinesRow = (string | number)[];

/**
 * Parses Binance klines API response into PriceHistoryPoint[].
 */
export function parseKlinesToHistory(rows: KlinesRow[]): PriceHistoryPoint[] {
  return rows.map((r) => ({
    time: r[0] as number,
    open: parseFloat(String(r[1])),
    high: parseFloat(String(r[2])),
    low: parseFloat(String(r[3])),
    close: parseFloat(String(r[4])),
    volume: parseFloat(String(r[5])),
  }));
}

/**
 * Builds the Binance klines API URL for the given params.
 */
export function buildKlinesUrl(
  baseUrl: string,
  symbol: string,
  interval: string,
  limit: number,
): string {
  const params = new URLSearchParams({
    symbol: symbol.toUpperCase(),
    interval,
    limit: String(limit),
  });
  return `${baseUrl}?${params.toString()}`;
}

// --- Tracker (live trade) ---

/**
 * Computes the next LivePrice from a trade event, optional existing state, and optional tracker info.
 * Derived fields (prevPrice, openPrice, changePercent, high, low, volume, tradeCount) are computed here.
 */
export function tradeToLivePrice(
  trade: TradeEvent,
  existing: LivePrice | undefined,
  info: TrackerInfo | undefined,
): LivePrice {
  const price = parseFloat(trade.p);
  const quantity = parseFloat(trade.q);

  const prevPrice = existing?.price ?? price;
  const openPrice = existing?.openPrice ?? price;
  const changePercent =
    openPrice !== 0 ? ((price - openPrice) / openPrice) * 100 : 0;
  const high = existing ? Math.max(existing.high, price) : price;
  const low = existing ? Math.min(existing.low, price) : price;
  const volume = (existing?.volume ?? 0) + quantity * price;
  const tradeCount = (existing?.tradeCount ?? 0) + 1;

  return {
    symbol: trade.s,
    name: info?.name ?? trade.s,
    icon: info?.icon ?? "",
    price,
    prevPrice,
    openPrice,
    changePercent,
    high,
    low,
    volume,
    tradeCount,
    quantity,
    isBuyerMaker: trade.m,
    tradeId: trade.t,
  };
}
