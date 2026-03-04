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
      className={`bg-surface border border-border rounded-lg py-3 px-3 transition-colors hover:bg-surface-hover hover:border-border shadow-sm sm:rounded-xl sm:py-5 sm:px-5 ${onClick ? "cursor-pointer" : ""} ${className ?? ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Left: icon + name + description */}
        <div className="flex items-center gap-2 min-w-0 flex-1 sm:gap-3">
          {tracker.icon && (
            <div className="relative shrink-0">
              <img
                className="w-8 h-8 rounded-full object-contain sm:w-10 sm:h-10"
                src={tracker.icon}
                alt={tracker.symbol}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex flex-col min-w-0 gap-0.5">
            <span className="font-bold text-sm text-white truncate sm:text-base">
              {tracker.name}
            </span>
            <span className="text-xs text-muted truncate">
              {tracker.description}
            </span>
          </div>
        </div>

        {/* Badge + stacked prices */}
        <div className="flex items-center gap-2 ml-auto shrink-0 sm:gap-4">
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
