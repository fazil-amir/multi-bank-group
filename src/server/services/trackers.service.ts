import WebSocket from "ws";
import { TRACKER_WS_URL } from "@shared/constants/tracker.constants";
import { TRACKERS } from "@shared/constants/trackerSymbols.constants";
import type { LivePrice, TrackerMessage } from "@shared/types/market.types";
import { tradeToLivePrice } from "@shared/utils/trackerData.utils";

const trackerById = new Map(TRACKERS.map((t) => [t.id.toUpperCase(), t]));

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
    const existing = prices.get(trade.s);
    const info = trackerById.get(trade.s);
    prices.set(trade.s, tradeToLivePrice(trade, existing, info));
  });

  ws.on("error", (err) => {
    console.error("Tracker WebSocket error:", err);
  });
}

export function getLivePrices(): LivePrice[] {
  return Array.from(prices.values());
}
