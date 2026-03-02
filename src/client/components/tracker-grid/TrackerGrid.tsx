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
    return <p className="text-muted py-5 text-sm">Loading trackers...</p>;
  }

  const visible = expanded ? trackers : trackers.slice(0, INITIAL_COUNT);
  const hasMore = trackers.length > INITIAL_COUNT;

  return (
    <div>
      <div className="grid grid-cols-4 gap-5 mb-8">
        {visible.map((t) => (
          <TrackerCard key={t.id} tracker={t} price={priceMap[t.id.toUpperCase()]} />
        ))}
      </div>
      {hasMore && (
        <button
          className="block mt-6 mb-10 py-3.5 px-8 bg-surface border-2 border-accent text-accent rounded-xl text-sm font-semibold cursor-pointer hover:bg-accent hover:text-white transition-colors"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
