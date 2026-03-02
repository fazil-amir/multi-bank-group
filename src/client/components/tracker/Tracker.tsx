import { useMemo, type CSSProperties } from "react";
import type { LivePrice, PriceWithTrend, Trend } from "@shared/types/market.types";
import { Table, type ColumnDef } from "../table";
import type { PriceMap } from "../../hooks/useLivePrices";

const TREND_COLORS: Record<Trend, string | undefined> = {
  up: "#22c55e",
  down: "#ef4444",
  unchanged: undefined,
};

function trendStyle(field: keyof LivePrice) {
  return (
    _v: PriceWithTrend[keyof PriceWithTrend],
    record: PriceWithTrend,
  ): CSSProperties | undefined => {
    const trend = record.trends[field];
    const color = trend ? TREND_COLORS[trend] : undefined;
    return color ? { color } : undefined;
  };
}

function formatPrice(n: number): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toFixed(2);
}

const columns: ColumnDef<PriceWithTrend>[] = [
  {
    key: "symbol",
    title: "Symbol",
    dataIndex: "symbol",
    align: "left",
    cellStyle: () => ({ fontWeight: 600 }),
  },
  {
    key: "price",
    title: "Price",
    dataIndex: "price",
    render: (v) => `$${formatPrice(v as number)}`,
    cellStyle: trendStyle("price"),
  },
  {
    key: "high",
    title: "High",
    dataIndex: "high",
    render: (v) => `$${formatPrice(v as number)}`,
    cellStyle: trendStyle("high"),
  },
  {
    key: "low",
    title: "Low",
    dataIndex: "low",
    render: (v) => `$${formatPrice(v as number)}`,
    cellStyle: trendStyle("low"),
  },
  {
    key: "volume",
    title: "Volume",
    dataIndex: "volume",
    render: (v) => `$${formatVolume(v as number)}`,
    cellStyle: trendStyle("volume"),
  },
  {
    key: "tradeCount",
    title: "Trades",
    dataIndex: "tradeCount",
    render: (v) => (v as number).toLocaleString(),
    cellStyle: trendStyle("tradeCount"),
  },
  {
    key: "side",
    title: "Side",
    dataIndex: "isBuyerMaker",
    render: (v) => ((v as boolean) ? "Sell" : "Buy"),
    cellStyle: (v) => ({ color: (v as boolean) ? "#ef4444" : "#22c55e" }),
  },
];

interface TrackerProps {
  priceMap: PriceMap;
}

export function Tracker({ priceMap }: TrackerProps) {
  const data = useMemo(() => Object.values(priceMap), [priceMap]);

  return (
    <Table<PriceWithTrend>
      columns={columns}
      data={data}
      rowKey="symbol"
      emptyText="Waiting for data..."
    />
  );
}
