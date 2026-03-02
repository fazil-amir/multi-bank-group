import type { Request, Response } from "express";
import { TRACKERS } from "@shared/constants/tracker-symbols.constants";
import { SSE_INTERVAL_MS } from "@shared/constants/tracker.constants";
import { getLivePrices } from "../services/tracker.service";

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
