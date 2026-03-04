export const APP_NAME = "Multi Bank Crypto Dashboard";
/** Short label for mobile header (e.g. "MCD"). */
export const APP_INITIALS = "MCD";
export const APP_VERSION = "1.0.0";
/** Same-origin in production (empty = use current host); in dev defaults to localhost:4000 unless VITE_API_BASE_URL is set. */
const env = typeof import.meta !== "undefined" ? (import.meta as { env?: { VITE_API_BASE_URL?: string; MODE?: string } }).env : undefined;
export const API_BASE_URL =
  env?.VITE_API_BASE_URL ??
  (env?.MODE === "production" ? "" : "http://localhost:4000");
export const API_PORT = 4000;
