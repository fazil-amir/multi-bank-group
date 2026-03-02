import { APP_NAME } from "@shared/constants/app.constants";
import { useLivePrices } from "../hooks/useLivePrices";
import { useTrackers } from "../hooks/useTrackers";
import { TrackerGrid } from "../components/tracker-grid";
import { TrackerTable } from "../components/tracker-table";

export default function App() {
  const { trackers, loading, error: trackersError } = useTrackers();
  const { priceMap, error: streamError } = useLivePrices();

  const error = trackersError ?? streamError;

  return (
    <main className="max-w-[1400px] mx-auto px-10 py-10">
      <h1 className="text-2xl font-bold mb-8 text-white">{APP_NAME}</h1>
      {error && (
        <p className="text-negative py-4 px-4 bg-surface border border-negative rounded-lg text-sm">
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
    </main>
  );
}
