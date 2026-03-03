import type { PriceWithTrend } from "@shared/types/market.types";

function formatPrice(n: number): string {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function PriceTrailing({ price }: { price?: PriceWithTrend }) {
  if (!price) {
    return (
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-muted text-sm">—</span>
        <span className="text-muted text-sm">—</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-end gap-0.5 tabular-nums">
      <span className="text-negative text-sm font-semibold">
        {formatPrice(price.low)}
      </span>
      <span className="text-positive text-sm font-semibold">
        {formatPrice(price.high)}
      </span>
    </div>
  );
}
