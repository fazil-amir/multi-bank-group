import type { TrackerInfo, PriceWithTrend } from "@shared/types/market.types";
import { PriceTrailing } from "./PriceTrailing";

export interface TrackerCardProps {
  tracker: TrackerInfo;
  price?: PriceWithTrend;
  className?: string;
  onClick?: () => void;
}

export function TrackerCard({ tracker, price, className, onClick }: TrackerCardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl py-5 px-5 transition-colors hover:bg-surface-hover hover:border-border shadow-sm ${className ?? ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="flex items-center gap-4">
        {tracker.icon && (
          <img
            className="w-9 h-9 rounded-full shrink-0 object-contain"
            src={tracker.icon}
            alt={tracker.symbol}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="flex flex-col min-w-0 flex-1 gap-0.5">
          <span className="font-semibold text-sm text-white truncate">{tracker.name}</span>
          <span className="text-xs text-muted truncate">{tracker.description}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5 ml-auto shrink-0 tabular-nums">
          <PriceTrailing price={price} />
        </div>
      </div>
    </div>
  );
}
