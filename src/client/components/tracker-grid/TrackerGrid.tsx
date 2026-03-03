import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PriceMap, TrackerInfo } from "@shared/types/market.types";
import { TrackerCard, TrackerCardShimmer } from "../tracker-card";

const INITIAL_COUNT = 8;

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
      <div className="grid grid-cols-4 gap-5 mb-8">
        {pricesLoading
          ? visible.map((t) => <TrackerCardShimmer key={t.id} />)
          : visible.map((t) => (
              <TrackerCard
                key={t.id}
                tracker={t}
                price={priceMap[t.id.toUpperCase()]}
                onClick={() => navigate(`/trackers/${t.id}`)}
              />
            ))}
      </div>
      {hasMore && !pricesLoading && (
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
