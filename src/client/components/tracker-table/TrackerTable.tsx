import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { LivePrice, PriceWithTrend, Trend } from "@shared/types/market.types";
import { Table, type ColumnDef } from "../../ui/table";
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
    render: (_v, record): ReactNode => (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
        {record.icon && (
          <img
            src={record.icon}
            alt={record.symbol}
            style={{ width: 22, height: 22, borderRadius: "50%" }}
          />
        )}
        {record.name}
      </span>
    ),
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

const INITIAL_COUNT = 8;

interface TrackerTableProps {
  priceMap: PriceMap;
}

export function TrackerTable({ priceMap }: TrackerTableProps) {
  const [expanded, setExpanded] = useState(false);
  const data = useMemo(() => Object.values(priceMap), [priceMap]);

  const visible = expanded ? data : data.slice(0, INITIAL_COUNT);
  const hasMore = data.length > INITIAL_COUNT;

  return (
    <div>
      <Table<PriceWithTrend>
        columns={columns}
        data={visible}
        rowKey="symbol"
        emptyText="Waiting for data..."
      />
      {hasMore && (
        <button className="show-toggle" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
