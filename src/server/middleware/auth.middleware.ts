import type { NextFunction, Request, Response } from "express";
import { getCookieName, verifyToken } from "../services/auth.service";

export interface AuthRequest extends Request {
  user?: { email: string };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[getCookieName()];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.user = user;
  next();
}
