import { useTrackerData } from "../contexts/TrackerDataContext";
import { TrackerGrid } from "../components/tracker-grid";
import { TrackerTable } from "../components/tracker-table";

export function TrackersPage() {
  const { trackers, priceMap, loading, error } = useTrackerData();

  return (
    <>
      {error && (
        <p className="text-negative py-3 px-3 sm:py-4 sm:px-4 bg-surface border border-negative rounded-lg text-xs sm:text-sm mb-4 sm:mb-6">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-muted py-4 sm:py-8 text-sm">Loading...</p>
      ) : (
        <>
          <section className="border-b border-border mb-6 pb-2">
            <h2 className="text-base font-semibold text-accent mb-3 sm:text-lg sm:mb-5">
              Trackers
            </h2>
            <TrackerGrid trackers={trackers} priceMap={priceMap} />
          </section>
          <section className="pt-2 sm:pt-4">
            <h2 className="text-base font-semibold text-accent mb-3 sm:text-lg sm:mb-5">
              Price Table
            </h2>
            <TrackerTable priceMap={priceMap} />
          </section>
        </>
      )}
    </>
  );
}
