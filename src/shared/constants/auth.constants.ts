/**
 * Static auth config. In production use env for JWT_SECRET.
 * Password hashes are bcrypt (cost 10).
 * Demo users: alice@example.com / password1, bob@example.com / password2, carol@example.com / password3.
 */
export const JWT_SECRET = "ilwN75fog8letgnjpBis2b$10$WZHYIH9auRilIjGKPHrv";
export const AUTH_COOKIE_NAME = "auth";
export const JWT_EXPIRES_IN = "24h";

export interface StaticUser {
  email: string;
  passwordHash: string;
}

export const STATIC_USERS: StaticUser[] = [
  {
    email: "alice@example.com",
    passwordHash: "$2b$10$WZHYIH9auRilwN75fog8letgnjpBisHw4Rg0NRq.BDQXCaAoyocxu",
  },
  {
    email: "bob@example.com",
    passwordHash: "$2b$10$DpqQLFbt/TfOT8OFuYQ4H.pCIjGKPHrvcWO1FfPi2FYa4T0KEVQ76",
  },
  {
    email: "carol@example.com",
    passwordHash: "$2b$10$D4QH6FM7iGmMirn3pLy0HeKv2LLLG9IJEcvMbad566iEGZJ14azMq",
  },
];

/** Demo credentials for login page hint (email / password). */
export const DEMO_HINT = [
  { email: "alice@example.com", password: "password1" },
  { email: "bob@example.com", password: "password2" },
  { email: "carol@example.com", password: "password3" },
] as const;
