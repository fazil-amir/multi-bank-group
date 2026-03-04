import { useEffect, useState } from "react";
import { API_BASE_URL } from "@shared/constants/app.constants";
import { ENDPOINTS } from "@shared/constants/api.constants";
import {
  CACHED_AT_HEADER,
  HISTORY_CACHE_NAME,
  HISTORY_CACHE_TTL_MS,
} from "@shared/constants/tracker.constants";
import type { PriceHistoryPoint } from "@shared/types/market.types";

async function getCachedHistory(
  cache: Cache,
  request: Request,
): Promise<PriceHistoryPoint[] | null> {
  const cached = await cache.match(request);
  if (!cached) return null;
  const cachedAt = cached.headers.get(CACHED_AT_HEADER);
  if (cachedAt) {
    const age = Date.now() - parseInt(cachedAt, 10);
    if (age > HISTORY_CACHE_TTL_MS) {
      await cache.delete(request);
      return null;
    }
  }
  return cached.json() as Promise<PriceHistoryPoint[]>;
}

async function fetchAndCacheHistory(
  url: string,
  cache: Cache,
  request: Request,
): Promise<PriceHistoryPoint[]> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as PriceHistoryPoint[];
  const headers = new Headers(res.headers);
  headers.set(CACHED_AT_HEADER, Date.now().toString());
  const cacheResponse = new Response(JSON.stringify(data), {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
  await cache.put(request, cacheResponse);
  return data;
}

export function useHistory(symbol: string | undefined): {
  history: PriceHistoryPoint[];
  loading: boolean;
  error: string | null;
} {
  const [history, setHistory] = useState<PriceHistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setHistory([]);
      setLoading(false);
      setError(null);
      return;
    }
    setHistory([]);
    setLoading(true);
    setError(null);

    const url = `${API_BASE_URL}${ENDPOINTS.TRACKERS}/${encodeURIComponent(symbol)}`;
    const request = new Request(url);

    const run = async () => {
      try {
        if (!("caches" in window)) {
          const res = await fetch(url, { credentials: "include" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = (await res.json()) as PriceHistoryPoint[];
          setHistory(data);
          return;
        }
        const cache = await caches.open(HISTORY_CACHE_NAME);
        const cached = await getCachedHistory(cache, request);
        if (cached) {
          setHistory(cached);
          return;
        }
        const data = await fetchAndCacheHistory(url, cache, request);
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [symbol]);

  return { history, loading, error };
}
