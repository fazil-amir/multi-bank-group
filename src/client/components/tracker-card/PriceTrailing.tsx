import type { PriceWithTrend } from "@shared/types/market.types";

function formatPrice(n: number): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PriceTrailing({ price }: { price?: PriceWithTrend }) {
  return (
    <>
      <span style={{ color: "#22c55e", fontSize: "0.9rem", fontWeight: 600 }}>
        {price ? formatPrice(price.high) : "—"}
      </span>
      <span style={{ color: "#ef4444", fontSize: "0.9rem", fontWeight: 600 }}>
        {price ? formatPrice(price.low) : "—"}
      </span>
    </>
  );
}
