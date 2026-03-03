import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PriceMap, TrackerInfo } from "@shared/types/market.types";
import { TrackerCard, TrackerCardShimmer } from "../tracker-card";

const INITIAL_COUNT = 6;

interface TrackerGridProps {
  trackers: TrackerInfo[];
  priceMap: PriceMap;
}

export function TrackerGrid({ trackers, priceMap }: TrackerGridProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const pricesLoading = Object.keys(priceMap).length === 0;

  if (trackers.length === 0) {
    return <p className="text-muted py-5 text-sm">Loading trackers...</p>;
  }

  const visible = expanded ? trackers : trackers.slice(0, INITIAL_COUNT);
  const hasMore = trackers.length > INITIAL_COUNT;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 sm:gap-5 sm:mb-8">
        {pricesLoading
          ? visible.map((t) => <TrackerCardShimmer key={t.id} />)
          : visible.map((t) => (
              <TrackerCard
                key={t.id}
                tracker={t}
                price={priceMap[t.id.toUpperCase()]}
                priceLoading={pricesLoading}
                onClick={() => navigate(`/trackers/${t.id}`)}
              />
            ))}
      </div>
      {hasMore && !pricesLoading && (
        <button
          className="block mt-4 mb-6 py-2.5 px-5 sm:mt-6 sm:mb-10 sm:py-3.5 sm:px-8 bg-surface border-2 border-accent text-accent rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold cursor-pointer hover:bg-accent hover:text-white transition-colors text-left"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
