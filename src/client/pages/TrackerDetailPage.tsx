import { Link, useNavigate, useParams } from "react-router-dom";
import type { PriceMap, TrackerInfo } from "@shared/types/market.types";
import { TrackerChart } from "../components/tracker-chart";
import { useHistory } from "../hooks/useHistory";

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
      <div className="flex min-h-[60vh]">
        <aside className="w-[320px] shrink-0 border-r border-border bg-surface/50" />
        <div className="flex-1 p-6 text-muted text-sm">Loading...</div>
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
      <aside className="w-[360px] shrink-0 flex flex-col min-h-0 border-r border-border bg-surface">
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
        <nav className="scrollbar-theme flex-1 min-h-0 overflow-y-auto">
          {trackers.map((t) => {
            const price = priceMap[t.id.toUpperCase()];
            const isActive = id?.toLowerCase() === t.id.toLowerCase();
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => navigate(`/trackers/${t.id}`)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2 ${
                  isActive
                    ? "bg-surface-hover border-accent text-white"
                    : "border-transparent hover:bg-surface-hover/70 text-muted hover:text-white"
                }`}
              >
                {t.icon && (
                  <img
                    src={t.icon}
                    alt=""
                    className="w-8 h-8 rounded-full shrink-0 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{t.symbol}</div>
                  <div className="text-xs truncate text-muted">{t.name}</div>
                </div>
                {price != null && (
                  <div className="shrink-0 text-right tabular-nums">
                    <div className="text-sm font-medium text-white">
                      {price.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                    </div>
                    <div
                      className={`text-xs ${
                        (price.changePercent ?? 0) >= 0
                          ? "text-positive"
                          : "text-negative"
                      }`}
                    >
                      {(price.changePercent ?? 0) >= 0 ? "+" : ""}
                      {(price.changePercent ?? 0).toFixed(2)}%
                    </div>
                  </div>
                )}
              </button>
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
