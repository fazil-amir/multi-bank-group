import type { TrackerInfo, PriceWithTrend } from "@shared/types/market.types";
import { ChangeBadge } from "../tracker-card/ChangeBadge";

export interface TrackerOptionProps {
  tracker: TrackerInfo;
  price?: PriceWithTrend;
  priceLoading?: boolean;
  className?: string;
}

/** Minimal tracker row: icon + name/symbol + optional change badge (compact for dropdown). */
export function TrackerOption({
  tracker,
  price,
  priceLoading = false,
  className = "",
}: TrackerOptionProps) {
  return (
    <div
      className={`flex items-center gap-2 min-w-0 py-1.5 px-2.5 rounded-md hover:bg-surface-hover transition-colors ${className}`}
    >
      {tracker.icon && (
        <img
          className="w-5 h-5 rounded-full object-contain shrink-0"
          src={tracker.icon}
          alt=""
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-medium text-sm text-white truncate">
          {tracker.name}
        </span>
        <span className="text-xs text-muted truncate">
          {tracker.symbol}
        </span>
      </div>
      {price != null ? (
        <ChangeBadge changePercent={price.changePercent} className="shrink-0" />
      ) : priceLoading ? (
        <div className="shimmer h-4 w-10 rounded-full shrink-0" />
      ) : null}
    </div>
  );
}
