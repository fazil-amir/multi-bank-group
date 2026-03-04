import { describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import {
  getTrackersSymbols,
  getTrackerHistoryHandler,
} from "./trackers.controller";

vi.mock("../services/history.service", () => ({
  getTrackerHistory: vi.fn().mockResolvedValue([
    { time: 1, open: 100, high: 101, low: 99, close: 100.5, volume: 1000 },
  ]),
  isKnownSymbol: vi.fn((s: string) =>
    ["btcusdt", "ethusdt", "solusdt"].includes(s.toLowerCase()),
  ),
}));

describe("trackers.controller", () => {
  describe("getTrackersSymbols", () => {
    it("responds with JSON array of trackers", () => {
      const res = { json: vi.fn() } as unknown as Response;
      getTrackersSymbols({} as Request, res);
      expect(res.json).toHaveBeenCalledTimes(1);
      const payload = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(Array.isArray(payload)).toBe(true);
      expect(payload.length).toBeGreaterThan(0);
    });
  });

  describe("getTrackerHistoryHandler", () => {
    it("returns 404 for missing or unknown symbol", async () => {
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await getTrackerHistoryHandler(
        { params: {} } as Request<{ symbol: string }>,
        res,
      );
      expect(res.status).toHaveBeenCalledWith(404);

      await getTrackerHistoryHandler(
        { params: { symbol: "unknownusdt" } } as Request<{ symbol: string }>,
        res,
      );
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns history array for known symbol", async () => {
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      await getTrackerHistoryHandler(
        { params: { symbol: "btcusdt" } } as Request<{ symbol: string }>,
        res,
      );
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(Array.isArray((res.json as ReturnType<typeof vi.fn>).mock.calls[0][0])).toBe(true);
    });
  });
});
