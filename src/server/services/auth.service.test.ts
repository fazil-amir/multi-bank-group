import { describe, expect, it } from "vitest";
import {
  findUserByEmailAndPassword,
  getCookieName,
  signToken,
  verifyToken,
} from "./auth.service";

describe("auth.service", () => {
  describe("findUserByEmailAndPassword", () => {
    it("returns user for valid email and password", () => {
      const user = findUserByEmailAndPassword("alice@example.com", "password1");
      expect(user).toEqual({ email: "alice@example.com" });
    });
    it("returns null for wrong password", () => {
      expect(findUserByEmailAndPassword("alice@example.com", "wrong")).toBeNull();
    });
    it("returns null for unknown email", () => {
      expect(findUserByEmailAndPassword("unknown@example.com", "password1")).toBeNull();
    });
  });

  describe("signToken / verifyToken", () => {
    it("signs and verifies token", () => {
      const payload = { email: "alice@example.com" };
      const token = signToken(payload);
      expect(typeof token).toBe("string");
      const decoded = verifyToken(token);
      expect(decoded).toEqual(payload);
    });
    it("returns null for invalid token", () => {
      expect(verifyToken("invalid")).toBeNull();
    });
  });

  describe("getCookieName", () => {
    it("returns cookie name", () => {
      expect(getCookieName()).toBe("auth");
    });
  });
});
