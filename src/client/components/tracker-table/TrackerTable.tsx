import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { LivePrice, PriceWithTrend, Trend } from "@shared/types/market.types";
import { Table, type ColumnDef } from "../../ui/table";
import type { PriceMap } from "../../hooks/useLivePrices";

const TREND_COLORS: Record<Trend, string | undefined> = {
  up: "#00c853",
  down: "#ff4564",
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
      <span className="inline-flex items-center gap-2 font-semibold">
        {record.icon && (
          <img
            src={record.icon}
            alt={record.symbol}
            className="w-[22px] h-[22px] rounded-full"
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
    cellStyle: (v) => ({ color: (v as boolean) ? "#ff4564" : "#00c853" }),
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
        <button
          className="block mt-6 mb-10 py-3.5 px-8 bg-surface border-2 border-accent text-accent rounded-xl text-sm font-semibold cursor-pointer hover:bg-accent hover:text-white transition-colors"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
