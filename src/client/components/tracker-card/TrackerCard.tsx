import type { TrackerInfo, PriceWithTrend } from "@shared/types/market.types";
import { ChangeBadge } from "./ChangeBadge";
import { PriceTrailing } from "./PriceTrailing";

export interface TrackerCardProps {
  tracker: TrackerInfo;
  price?: PriceWithTrend;
  /** When true and price is missing, show loader in price area instead of "—" */
  priceLoading?: boolean;
  className?: string;
  onClick?: () => void;
}

export function TrackerCard({
  tracker,
  price,
  priceLoading = false,
  className,
  onClick,
}: TrackerCardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl py-5 px-5 transition-colors hover:bg-surface-hover hover:border-border shadow-sm ${onClick ? "cursor-pointer" : ""} ${className ?? ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="flex items-center gap-4">
        {/* Left: icon + name + description */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {tracker.icon && (
            <div className="relative shrink-0">
              <img
                className="w-10 h-10 rounded-full object-contain"
                src={tracker.icon}
                alt={tracker.symbol}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex flex-col min-w-0 gap-0.5">
            <span className="font-bold text-base text-white truncate">
              {tracker.name}
            </span>
            <span className="text-xs text-muted truncate">
              {tracker.description}
            </span>
          </div>
        </div>

        {/* Badge + stacked prices */}
        <div className="flex items-center gap-4 ml-auto shrink-0">
          {price != null ? (
            <>
              <ChangeBadge changePercent={price.changePercent} />
              <PriceTrailing price={price} />
            </>
          ) : priceLoading ? (
            <>
              <div className="shimmer h-6 w-14 rounded-full shrink-0" />
              <div className="flex flex-col items-end gap-0.5">
                <div className="shimmer h-4 w-16 rounded" />
                <div className="shimmer h-4 w-16 rounded" />
              </div>
            </>
          ) : (
            <>
              <span className="rounded-full bg-muted/30 px-2 py-0.5 text-xs text-muted">
                —
              </span>
              <PriceTrailing price={price} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
