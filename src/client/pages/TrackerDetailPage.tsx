import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { TrackerInfo } from "@shared/types/market.types";
import { TrackerCard, TrackerCardShimmer } from "../components/tracker-card";
import { TrackerChart } from "../components/tracker-chart";
import { TrackerDropdown } from "../components/tracker-dropdown";
import { useTrackerData } from "../contexts/TrackerDataContext";
import { useHistory } from "../hooks/useHistory";

function filterTrackersBySearch(
  list: TrackerInfo[],
  query: string,
): TrackerInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.symbol.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q),
  );
}

const LEFT_LOADER_CARD_COUNT = 6;

function TrackerChartWithHistory({ symbol }: { symbol: string }) {
  const { history, loading, error } = useHistory(symbol);
  return (
    <div className="flex-1 min-h-0 flex flex-col min-h-[50vh] md:min-h-0">
      <TrackerChart
        history={history}
        loading={loading}
        error={error}
        className="flex-1 min-h-0 h-full w-full"
      />
    </div>
  );
}

export function TrackerDetailPage() {
  const { trackers, priceMap, loading, error } = useTrackerData();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const tracker = id
    ? trackers.find((t) => t.id.toLowerCase() === id.toLowerCase())
    : undefined;

  const filteredTrackers = useMemo(
    () => filterTrackersBySearch(trackers, search),
    [trackers, search],
  );

  const selectedCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    const el = selectedCardRef.current;
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [id, filteredTrackers]);

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-[60vh] max-h-[calc(100vh-8rem)] rounded-xl border border-border overflow-hidden bg-surface/30">
        {/* Mobile: top bar with back + dropdown placeholder */}
        <div className="flex items-center gap-3 p-4 border-b border-border md:hidden shrink-0">
          <Link
            to="/"
            className="text-muted hover:text-accent text-sm font-medium shrink-0"
          >
            ← Back
          </Link>
          <div className="flex-1 h-10 rounded-lg bg-canvas border border-border shimmer" />
        </div>
        {/* Desktop: sidebar loader */}
        <aside className="hidden md:flex w-[420px] shrink-0 flex-col min-h-0 border-r border-border bg-surface">
          <div className="p-4 border-b border-border shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-muted hover:text-accent text-sm font-medium mb-3"
            >
              ← Back
            </Link>
            <h2 className="text-base font-semibold text-white">Symbols</h2>
            <div className="mt-3 h-10 rounded-lg bg-canvas border border-border shimmer" />
          </div>
          <nav className="scrollbar-theme flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3">
            {Array.from({ length: LEFT_LOADER_CARD_COUNT }).map((_, i) => (
              <TrackerCardShimmer key={i} />
            ))}
          </nav>
        </aside>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-negative py-4 px-4 bg-surface border border-negative rounded-lg text-sm">
        {error}
      </p>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[60vh] max-h-[calc(100vh-8rem)] rounded-xl border border-border overflow-hidden bg-surface/30">
      
      {/* Mobile: dropdown row (back + tracker select) */}
      <div className="flex items-center gap-3 p-4 border-b border-border md:hidden shrink-0">
        <Link
          to="/"
          className="text-muted hover:text-accent text-sm font-medium shrink-0"
        >
          ← Back
        </Link>
        <TrackerDropdown
          trackers={filteredTrackers}
          priceMap={priceMap}
          value={id ?? ""}
          onSelect={(symbolId) => navigate(`/trackers/${symbolId}`)}
          priceLoading={Object.keys(priceMap).length === 0}
          placeholder="Select tracker"
        />
      </div>

      {/* Desktop: Left sidebar — Symbols list */}
      <aside className="hidden md:flex w-[420px] shrink-0 flex-col min-h-0 border-r border-border bg-surface">
        <div className="p-4 border-b border-border shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-muted hover:text-accent text-sm font-medium mb-3"
          >
            ← Back
          </Link>
          <h2 className="text-base font-semibold text-white">Symbols</h2>
          <input
            type="search"
            placeholder="Search symbols"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 w-full px-3 py-2 rounded-lg bg-canvas border border-border text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Search symbols"
          />
        </div>
        <nav className="scrollbar-theme flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3">
          {filteredTrackers.length === 0 ? (
            <p className="text-muted text-sm py-2">No symbols match your search.</p>
          ) : (
            filteredTrackers.map((t) => {
            const isActive = id?.toLowerCase() === t.id.toLowerCase();
            return (
              <div key={t.id} ref={isActive ? selectedCardRef : undefined}>
                <TrackerCard
                  tracker={t}
                  price={priceMap[t.id.toUpperCase()]}
                  priceLoading={Object.keys(priceMap).length === 0}
                  onClick={() => navigate(`/trackers/${t.id}`)}
                  className={isActive ? "ring-2 ring-accent" : ""}
                />
              </div>
            );
          })
          )}
        </nav>
      </aside>

      {/* Chart area: full width on mobile, flex-1 on desktop */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {tracker ? (
          <>
            <div className="p-4 border-b border-border shrink-0">
              <h1 className="text-lg font-semibold text-white">
                {tracker.pair}
              </h1>
              <p className="text-sm text-muted">{tracker.name}</p>
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              <TrackerChartWithHistory symbol={tracker.id} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-muted min-h-[50vh] md:min-h-0">
            <p className="text-sm">
              {id ? "Tracker not found." : "Select a symbol from the list."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
