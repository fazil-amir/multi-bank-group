import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  AUTH_COOKIE_NAME,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  STATIC_USERS,
} from "@shared/constants/auth.constants";

export interface AuthUser {
  email: string;
}

export function findUserByEmailAndPassword(
  email: string,
  password: string,
): AuthUser | null {
  const user = STATIC_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) return null;
  return { email: user.email };
}

export function signToken(payload: AuthUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return { email: decoded.email };
  } catch {
    return null;
  }
}

export function getCookieName(): string {
  return AUTH_COOKIE_NAME;
}
