import type { Request, Response } from "express";
import {
  findUserByEmailAndPassword,
  getCookieName,
  signToken,
} from "../services/auth.service";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 24 * 60 * 60 * 1000, // 24h
  path: "/",
};

export function login(req: Request, res: Response): void {
  const { email, password } = req.body ?? {};
  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  const user = findUserByEmailAndPassword(email.trim(), password);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const token = signToken(user);
  res.cookie(getCookieName(), token, COOKIE_OPTIONS);
  res.status(200).json({ user: { email: user.email } });
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie(getCookieName(), { path: "/" });
  res.status(200).json({ ok: true });
}

export function me(req: Request, res: Response): void {
  const user = (req as { user?: { email: string } }).user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.status(200).json({ user: { email: user.email } });
}
