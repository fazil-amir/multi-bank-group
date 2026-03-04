import { describe, expect, it } from "vitest";
import { connectTracker, getLivePrices } from "./trackers.service";

describe("trackers.service", () => {
  describe("getLivePrices", () => {
    it("returns an array", () => {
      const result = getLivePrices();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("connectTracker", () => {
    it("is a function", () => {
      expect(typeof connectTracker).toBe("function");
    });
  });
});
