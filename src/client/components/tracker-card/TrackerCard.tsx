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
      className={`tracker-card ${className ?? ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="tracker-card__header">
        {tracker.icon && (
          <img
            className="tracker-card__icon"
            src={tracker.icon}
            alt={tracker.symbol}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="tracker-card__info">
          <span className="tracker-card__title">{tracker.name}</span>
          <span className="tracker-card__subtitle">{tracker.description}</span>
        </div>
        <div className="tracker-card__trailing">
          <PriceTrailing price={price} />
        </div>
      </div>
    </div>
  );
}
