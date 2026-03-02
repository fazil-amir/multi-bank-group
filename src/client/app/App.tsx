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
    <main>
      <h1>{APP_NAME}</h1>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <section className="tracker-grid-section">
          <h2 className="section-heading">Trackers</h2>
          <TrackerGrid trackers={trackers} priceMap={priceMap} />
        </section>
      )}
      <section className="tracker-table-section">
        <h2 className="section-heading">Price Table</h2>
        <TrackerTable priceMap={priceMap} />
      </section>
    </main>
  );
}
