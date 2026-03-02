import type { Ticker } from "@shared/types/market.types.js"
import { ENDPOINTS } from "@shared/constants/api.constants.js"
import { apiFetch } from "@shared/utils/fetch.utils.js"

export function fetchTickers(): Promise<Ticker[]> {
  return apiFetch<Ticker[]>(ENDPOINTS.TICKERS)
}
