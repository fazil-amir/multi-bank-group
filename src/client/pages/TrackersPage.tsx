import { useLivePrices } from "../hooks/useLivePrices";
import { useTrackers } from "../hooks/useTrackers";
import { TrackerGrid } from "../components/tracker-grid";
import { TrackerTable } from "../components/tracker-table";

export function TrackersPage() {
  const { trackers, loading, error: trackersError } = useTrackers();
  const { priceMap, error: pricesError } = useLivePrices();
  const error = trackersError ?? pricesError;

  return (
    <>
      {error && (
        <p className="text-negative py-4 px-4 bg-surface border border-negative rounded-lg text-sm mb-6">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-muted py-8 text-sm">Loading...</p>
      ) : (
        <section className="mb-12 pb-12 border-b border-border">
          <h2 className="text-lg font-semibold text-accent mb-5">Trackers</h2>
          <TrackerGrid trackers={trackers} priceMap={priceMap} />
        </section>
      )}
      <section className="pt-4">
        <h2 className="text-lg font-semibold text-accent mb-5">Price Table</h2>
        <TrackerTable priceMap={priceMap} />
      </section>
    </>
  );
}
