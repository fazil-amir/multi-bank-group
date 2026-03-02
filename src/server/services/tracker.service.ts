import WebSocket from "ws";
import { TRACKER_WS_URL } from "@shared/constants/tracker.constants";
import type { TrackerMessage, LivePrice } from "@shared/types/market.types";

// Single-process in-memory store. Use Redis for distributed systems.
const prices = new Map<string, LivePrice>();

let ws: WebSocket | null = null;

export function connectTracker(): void {
  ws = new WebSocket(TRACKER_WS_URL);

  ws.on("open", () => {
    // eslint-disable-next-line no-console
    console.log("Connected to tracker WebSocket");
  });

  ws.on("message", (raw) => {
    const { data: trade } = JSON.parse(raw.toString()) as TrackerMessage;

    const price = parseFloat(trade.p);
    const quantity = parseFloat(trade.q);
    const existing = prices.get(trade.s); 

    // Derived fields are computed on write so reads are O(1) with zero allocation.
    const prevPrice = existing?.price ?? price;
    const high = existing ? Math.max(existing.high, price) : price;
    const low = existing ? Math.min(existing.low, price) : price;
    const volume = (existing?.volume ?? 0) + quantity * price;
    const tradeCount = (existing?.tradeCount ?? 0) + 1;

    prices.set(trade.s, {
      symbol: trade.s,
      price,
      prevPrice,
      high,
      low,
      volume,
      tradeCount,
      quantity,
      isBuyerMaker: trade.m,
      tradeId: trade.t,
    });
  });

  ws.on("error", (err) => {
    console.error("Tracker WebSocket error:", err);
  });
}

export function getLivePrices(): LivePrice[] {
  return Array.from(prices.values());
}
