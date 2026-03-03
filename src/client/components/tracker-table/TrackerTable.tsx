import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { LivePrice, PriceWithTrend, Trend } from "@shared/types/market.types";
import { Table, type ColumnDef } from "../../ui/table";
import type { PriceMap } from "@shared/types/market.types";
import { TableShimmer } from "./TableShimmer";

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
      <span className="inline-flex items-center gap-1.5 font-semibold sm:gap-2">
        {record.icon && (
          <img
            src={record.icon}
            alt={record.symbol}
            className="w-5 h-5 rounded-full sm:w-[22px] sm:h-[22px]"
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
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const data = useMemo(() => Object.values(priceMap), [priceMap]);

  const visible = expanded ? data : data.slice(0, INITIAL_COUNT);
  const hasMore = data.length > INITIAL_COUNT;
  const pricesLoading = data.length === 0;

  const handleRowClick = (record: PriceWithTrend) => {
    navigate(`/trackers/${record.symbol.toLowerCase()}`);
  };

  return (
    <div>
      {pricesLoading ? (
        <TableShimmer />
      ) : (
        <Table<PriceWithTrend>
          columns={columns}
          data={visible}
          rowKey="symbol"
          emptyText="Waiting for data..."
          onRowClick={handleRowClick}
        />
      )}
      {hasMore && !pricesLoading && (
        <button
          className="block mt-4 mb-6 py-2.5 px-5 sm:mt-6 sm:mb-10 sm:py-3.5 sm:px-8 bg-surface border-2 border-accent text-accent rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold cursor-pointer hover:bg-accent hover:text-white transition-colors text-left"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
