import { describe, expect, it } from "vitest";
import {
  buildKlinesUrl,
  parseKlinesToHistory,
  tradeToLivePrice,
} from "./trackerData.utils";

describe("trackerData.utils", () => {
  describe("parseKlinesToHistory", () => {
    it("parses klines rows into PriceHistoryPoint[]", () => {
      const rows: (string | number)[][] = [
        [1704067200000, "42000", "42500", "41800", "42200", "1000"],
      ];
      const result = parseKlinesToHistory(rows);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ open: 42000, high: 42500, low: 41800, close: 42200 });
    });
    it("returns empty array for empty input", () => {
      expect(parseKlinesToHistory([])).toEqual([]);
    });
  });

  describe("buildKlinesUrl", () => {
    it("builds URL with symbol, interval, limit", () => {
      const url = buildKlinesUrl("https://api.example.com/klines", "btcusdt", "1d", 366);
      expect(url).toContain("symbol=BTCUSDT");
      expect(url).toContain("interval=1d");
      expect(url).toContain("limit=366");
    });
  });

  describe("tradeToLivePrice", () => {
    it("builds LivePrice from trade", () => {
      const result = tradeToLivePrice(
        { s: "BTCUSDT", p: "50000", q: "0.1", m: false, t: 12345 },
        undefined,
        { id: "btcusdt", symbol: "BTC", name: "Bitcoin", description: "", pair: "BTC/USDT", icon: "" },
      );
      expect(result.symbol).toBe("BTCUSDT");
      expect(result.price).toBe(50000);
      expect(result.tradeCount).toBe(1);
    });
  });
});
