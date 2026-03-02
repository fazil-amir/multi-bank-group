import type { TrackerInfo } from "@shared/types/market.types";

const ICON_BASE =
  "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color";

function icon(symbol: string): string {
  return `${ICON_BASE}/${symbol.toLowerCase()}.png`;
}

export const TRACKERS: TrackerInfo[] = [
  {
    id: "btcusdt",
    symbol: "BTC",
    name: "Bitcoin",
    description: "Bitcoin Spot / USDT",
    pair: "BTC/USDT",
    icon: icon("btc"),
  },
  {
    id: "ethusdt",
    symbol: "ETH",
    name: "Ethereum",
    description: "Ethereum Spot / USDT",
    pair: "ETH/USDT",
    icon: icon("eth"),
  },
  {
    id: "solusdt",
    symbol: "SOL",
    name: "Solana",
    description: "Solana Spot / USDT",
    pair: "SOL/USDT",
    icon: icon("sol"),
  },
  {
    id: "bnbusdt",
    symbol: "BNB",
    name: "BNB",
    description: "BNB Spot / USDT",
    pair: "BNB/USDT",
    icon: icon("bnb"),
  },
  {
    id: "adausdt",
    symbol: "ADA",
    name: "Cardano",
    description: "Cardano Spot / USDT",
    pair: "ADA/USDT",
    icon: icon("ada"),
  },
  {
    id: "xrpusdt",
    symbol: "XRP",
    name: "Ripple",
    description: "Ripple Spot / USDT",
    pair: "XRP/USDT",
    icon: icon("xrp"),
  },
  {
    id: "dogeusdt",
    symbol: "DOGE",
    name: "Dogecoin",
    description: "Dogecoin Spot / USDT",
    pair: "DOGE/USDT",
    icon: icon("doge"),
  },
  {
    id: "maticusdt",
    symbol: "MATIC",
    name: "Polygon",
    description: "Polygon Spot / USDT",
    pair: "MATIC/USDT",
    icon: icon("matic"),
  },
  {
    id: "dotusdt",
    symbol: "DOT",
    name: "Polkadot",
    description: "Polkadot Spot / USDT",
    pair: "DOT/USDT",
    icon: icon("dot"),
  },
  {
    id: "ltcusdt",
    symbol: "LTC",
    name: "Litecoin",
    description: "Litecoin Spot / USDT",
    pair: "LTC/USDT",
    icon: icon("ltc"),
  },
  {
    id: "avaxusdt",
    symbol: "AVAX",
    name: "Avalanche",
    description: "Avalanche Spot / USDT",
    pair: "AVAX/USDT",
    icon: icon("avax"),
  },
  {
    id: "linkusdt",
    symbol: "LINK",
    name: "Chainlink",
    description: "Chainlink Spot / USDT",
    pair: "LINK/USDT",
    icon: icon("link"),
  },
  {
    id: "atomusdt",
    symbol: "ATOM",
    name: "Cosmos",
    description: "Cosmos Spot / USDT",
    pair: "ATOM/USDT",
    icon: icon("atom"),
  },
  {
    id: "trxusdt",
    symbol: "TRX",
    name: "TRON",
    description: "TRON Spot / USDT",
    pair: "TRX/USDT",
    icon: icon("trx"),
  },
  {
    id: "uniusdt",
    symbol: "UNI",
    name: "Uniswap",
    description: "Uniswap Spot / USDT",
    pair: "UNI/USDT",
    icon: icon("uni"),
  },
  {
    id: "xlmusdt",
    symbol: "XLM",
    name: "Stellar",
    description: "Stellar Spot / USDT",
    pair: "XLM/USDT",
    icon: icon("xlm"),
  }
];
