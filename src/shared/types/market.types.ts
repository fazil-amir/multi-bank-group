export interface Ticker {
  symbol: string;
  price: number;
}

export interface LivePrice {
  symbol: string;
  price: number;
  prevPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  tradeCount: number;
  quantity: number;
  timestamp: number;
  isBuyerMaker: boolean;
  tradeId: number;
}

export interface TradeEvent {
  s: string; // symbol
  p: string; // price
  q: string; // quantity
  T: number; // trade time
  m: boolean; // is buyer maker
  t: number; // trade id
}

export interface TrackerMessage {
  data: TradeEvent;
}
