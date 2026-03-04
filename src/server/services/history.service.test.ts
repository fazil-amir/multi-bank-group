import { describe, expect, it } from "vitest";
import { isKnownSymbol } from "./history.service";

describe("history.service", () => {
  describe("isKnownSymbol", () => {
    it("returns true for known symbols", () => {
      expect(isKnownSymbol("btcusdt")).toBe(true);
      expect(isKnownSymbol("ETHUSDT")).toBe(true);
    });
    it("returns false for unknown symbols", () => {
      expect(isKnownSymbol("unknown")).toBe(false);
    });
  });
});
