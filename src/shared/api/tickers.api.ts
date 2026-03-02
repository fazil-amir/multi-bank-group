import type { Ticker } from "@shared/types/market.types";
import { ENDPOINTS } from "@shared/constants/api.constants";
import { apiFetch } from "@shared/utils/fetch.utils";

export function fetchTickers(): Promise<Ticker[]> {
  return apiFetch<Ticker[]>(ENDPOINTS.TICKERS);
}
