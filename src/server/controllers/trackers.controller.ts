import type { Request, Response } from "express";
import { TRACKERS } from "@shared/constants/trackerSymbols.constants";
import { SSE_INTERVAL_MS } from "@shared/constants/tracker.constants";
import {
  getTrackerHistory,
  isKnownSymbol,
} from "../services/history.service";
import { getLivePrices } from "../services/trackers.service";

export function getTrackersSymbols(_req: Request, res: Response): void {
  res.json(TRACKERS);
}

// NOTE: Each connected client gets its own setInterval timer. This is fine for
// low client counts (<100). At scale, replace with a single shared interval that
// broadcasts to a Set<Response> of connected clients — eliminates N timers and
// ensures all clients receive the same snapshot at the same wall-clock time.
export function getTrackersStreams(req: Request, res: Response): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const interval = setInterval(() => {
    const payload = getLivePrices();
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }, SSE_INTERVAL_MS);

  req.on("close", () => {
    clearInterval(interval);
  });
}

export async function getTrackerHistoryHandler(
  req: Request<{ symbol: string }>,
  res: Response,
): Promise<void> {
  const { symbol } = req.params;
  if (!symbol || !isKnownSymbol(symbol)) {
    res.status(404).json({ error: "Tracker not found" });
    return;
  }
  try {
    const data = await getTrackerHistory(symbol);
    res.json(data);
  } catch (err) {
    console.error("Tracker history fetch error:", err);
    res.status(502).json({ error: "Failed to fetch price history" });
  }
}
