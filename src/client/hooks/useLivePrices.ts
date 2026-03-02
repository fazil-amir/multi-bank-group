import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@shared/constants/app.constants";
import { ENDPOINTS } from "@shared/constants/api.constants";
import type { LivePrice, PriceWithTrend, Trend, TrendMap } from "@shared/types/market.types";

export type PriceMap = Record<string, PriceWithTrend>;

const NUMERIC_KEYS: (keyof LivePrice)[] = [
  "price",
  "high",
  "low",
  "volume",
  "quantity",
  "tradeCount",
];

function computeTrends(prev: LivePrice | undefined, next: LivePrice): TrendMap {
  if (!prev) return {};
  const trends: TrendMap = {};
  for (const key of NUMERIC_KEYS) {
    const oldVal = prev[key] as number;
    const newVal = next[key] as number;
    let trend: Trend = "unchanged";
    if (newVal > oldVal) trend = "up";
    else if (newVal < oldVal) trend = "down";
    trends[key] = trend;
  }
  return trends;
}

export function useLivePrices(): { priceMap: PriceMap; error: string | null } {
  const [priceMap, setPriceMap] = useState<PriceMap>({});
  const [error, setError] = useState<string | null>(null);
  const bufferRef = useRef<Record<string, LivePrice>>({});
  const prevSnapshotRef = useRef<Record<string, LivePrice>>({});
  const dirtyRef = useRef(false);

  useEffect(() => {
    const es = new EventSource(`${API_BASE_URL}${ENDPOINTS.TRACKERS_STREAMS}`);

    es.onmessage = (event: MessageEvent<string>) => {
      const incoming = JSON.parse(event.data) as LivePrice[];
      for (const p of incoming) {
        bufferRef.current[p.symbol] = p;
      }
      dirtyRef.current = true;
    };

    const flushInterval = setInterval(() => {
      if (!dirtyRef.current) return;
      dirtyRef.current = false;

      const prev = prevSnapshotRef.current;
      const next: PriceMap = {};

      for (const [symbol, price] of Object.entries(bufferRef.current)) {
        next[symbol] = { ...price, trends: computeTrends(prev[symbol], price) };
      }

      prevSnapshotRef.current = { ...bufferRef.current };
      setPriceMap(next);
    }, 2000);

    es.onerror = () => {
      setError("Lost connection to price stream");
      es.close();
    };

    return () => {
      es.close();
      clearInterval(flushInterval);
    };
  }, []);

  return { priceMap, error };
}
