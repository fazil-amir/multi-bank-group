import type { Request, Response } from "express";
import { SSE_INTERVAL_MS } from "@shared/constants/tracker.constants";
import { getLivePrices } from "../services/tracker.service";

export function getTrackerPrices(req: Request, res: Response): void {
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
