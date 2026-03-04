import { describe, expect, it, vi } from "vitest";
import type { NextFunction, Response } from "express";
import { requireAuth } from "./auth.middleware";

describe("auth.middleware", () => {
  it("returns 401 when no cookie", () => {
    const req = { cookies: {} };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
    const next = vi.fn() as NextFunction;
    requireAuth(req as never, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token is invalid", () => {
    const req = { cookies: { auth: "invalid-token" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
    const next = vi.fn() as NextFunction;
    requireAuth(req as never, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
