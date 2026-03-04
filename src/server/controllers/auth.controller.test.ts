import { describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { login, logout, me } from "./auth.controller";

describe("auth.controller", () => {
  describe("login", () => {
    it("returns 400 when email or password missing", () => {
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
      login({ body: {} } as Request, res);
      expect(res.status).toHaveBeenCalledWith(400);
      login({ body: { email: "a@b.com" } } as Request, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 401 for invalid credentials", () => {
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn(), cookie: vi.fn() } as unknown as Response;
      login({ body: { email: "wrong@example.com", password: "wrong" } } as Request, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("returns 200 and sets cookie for valid credentials", () => {
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn(), cookie: vi.fn() } as unknown as Response;
      login({ body: { email: "alice@example.com", password: "password1" } } as Request, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: { email: "alice@example.com" } }));
    });
  });

  describe("logout", () => {
    it("clears cookie and returns 200", () => {
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn(), clearCookie: vi.fn() } as unknown as Response;
      logout({} as Request, res);
      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("me", () => {
    it("returns 401 when user not set", () => {
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
      me({} as Request, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("returns 200 with user when req.user set", () => {
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
      me({ user: { email: "alice@example.com" } } as Request, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: { email: "alice@example.com" } });
    });
  });
});
