export interface Ticker {
  symbol: string;
  price: number;
}

export interface TrackerInfo {
  id: string;
  symbol: string;
  name: string;
  description: string;
  pair: string;
  icon: string;
}

export interface LivePrice {
  symbol: string;
  name: string;
  icon: string;
  price: number;
  prevPrice: number;
  openPrice: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  tradeCount: number;
  quantity: number;
  isBuyerMaker: boolean;
  tradeId: number;
}

export interface TradeEvent {
  s: string; // symbol
  p: string; // price
  q: string; // quantity
  m: boolean; // is buyer maker
  t: number; // trade id
}

export interface TrackerMessage {
  data: TradeEvent;
}

export type Trend = "up" | "down" | "unchanged";

export type TrendMap = Partial<Record<keyof LivePrice, Trend>>;

export interface PriceWithTrend extends LivePrice {
  trends: TrendMap;
}

export type PriceMap = Record<string, PriceWithTrend>;

export interface PriceHistoryPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
