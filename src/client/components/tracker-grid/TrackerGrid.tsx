import { useState } from "react";
import type { TrackerInfo } from "@shared/types/market.types";
import type { PriceMap } from "../../hooks/useLivePrices";
import { TrackerCard } from "../tracker-card";

const INITIAL_COUNT = 8;

interface TrackerGridProps {
  trackers: TrackerInfo[];
  priceMap: PriceMap;
}

export function TrackerGrid({ trackers, priceMap }: TrackerGridProps) {
  const [expanded, setExpanded] = useState(false);

  if (trackers.length === 0) {
    return <p className="loading">Loading trackers...</p>;
  }

  const visible = expanded ? trackers : trackers.slice(0, INITIAL_COUNT);
  const hasMore = trackers.length > INITIAL_COUNT;

  return (
    <div>
      <div className="tracker-grid">
        {visible.map((t) => (
          <TrackerCard key={t.id} tracker={t} price={priceMap[t.id.toUpperCase()]} />
        ))}
      </div>
      {hasMore && (
        <button className="show-toggle" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
