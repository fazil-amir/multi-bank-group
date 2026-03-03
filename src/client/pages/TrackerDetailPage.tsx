import { Link, useNavigate, useParams } from "react-router-dom";
import type { PriceMap, TrackerInfo } from "@shared/types/market.types";
import { TrackerCard, TrackerCardShimmer } from "../components/tracker-card";
import { TrackerChart } from "../components/tracker-chart";
import { useHistory } from "../hooks/useHistory";

const LEFT_LOADER_CARD_COUNT = 6;

function TrackerChartWithHistory({ symbol }: { symbol: string }) {
  const { history, loading, error } = useHistory(symbol);
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TrackerChart
        history={history}
        loading={loading}
        error={error}
        className="flex-1 min-h-0 h-full"
      />
    </div>
  );
}

export interface TrackerDetailPageProps {
  trackers: TrackerInfo[];
  priceMap: PriceMap;
  loading: boolean;
  error: string | null;
}

export function TrackerDetailPage({
  trackers,
  priceMap,
  loading,
  error,
}: TrackerDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tracker = id
    ? trackers.find((t) => t.id.toLowerCase() === id.toLowerCase())
    : undefined;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] max-h-[calc(100vh-8rem)] rounded-xl border border-border overflow-hidden bg-surface/30">
        <aside className="w-[420px] shrink-0 flex flex-col min-h-0 border-r border-border bg-surface">
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
        <div className="flex-1 flex items-center justify-center p-6 text-muted text-sm">
          Loading…
        </div>
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
    <div className="flex min-h-[60vh] max-h-[calc(100vh-8rem)] rounded-xl border border-border overflow-hidden bg-surface/30">
      {/* Left: Symbols list */}
      <aside className="w-[420px] shrink-0 flex flex-col min-h-0 border-r border-border bg-surface">
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
            className="mt-3 w-full px-3 py-2 rounded-lg bg-canvas border border-border text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Search symbols"
          />
        </div>
        <nav className="scrollbar-theme flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3">
          {trackers.map((t) => {
            const isActive = id?.toLowerCase() === t.id.toLowerCase();
            return (
              <TrackerCard
                key={t.id}
                tracker={t}
                price={priceMap[t.id.toUpperCase()]}
                priceLoading={Object.keys(priceMap).length === 0}
                onClick={() => navigate(`/trackers/${t.id}`)}
                className={isActive ? "ring-2 ring-accent" : ""}
              />
            );
          })}
        </nav>
      </aside>

      {/* Right: Detail (dummy content for now) */}
      <div className="flex-1 flex flex-col min-w-0">
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
          <div className="flex-1 flex items-center justify-center p-6 text-muted">
            <p className="text-sm">
              {id ? "Tracker not found." : "Select a symbol from the list."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
