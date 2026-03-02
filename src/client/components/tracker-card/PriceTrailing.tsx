import type { PriceWithTrend } from "@shared/types/market.types";

function formatPrice(n: number): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PriceTrailing({ price }: { price?: PriceWithTrend }) {
  return (
    <>
      <span className="text-positive text-sm font-semibold">
        {price ? formatPrice(price.high) : "—"}
      </span>
      <span className="text-negative text-sm font-semibold">
        {price ? formatPrice(price.low) : "—"}
      </span>
    </>
  );
}
