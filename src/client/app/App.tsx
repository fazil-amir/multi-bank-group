import { Link, Route, Routes } from "react-router-dom";
import { APP_NAME } from "@shared/constants/app.constants";
import { useLivePrices } from "../hooks/useLivePrices";
import { useTrackers } from "../hooks/useTrackers";
import { TrackersPage } from "./pages/TrackersPage";
import { TrackerDetailPage } from "./pages/TrackerDetailPage";

export default function App() {
  const { trackers, loading, error: trackersError } = useTrackers();
  const { priceMap, error: pricesError } = useLivePrices();

  return (
    <main className="max-w-[1400px] mx-auto px-10 py-10">
      <h1 className="text-2xl font-bold mb-8 text-white">
        <Link to="/" className="hover:opacity-90">
          {APP_NAME}
        </Link>
      </h1>
      <Routes>
        <Route
          path="/"
          element={
            <TrackersPage
              trackers={trackers}
              priceMap={priceMap}
              loading={loading}
              error={trackersError ?? pricesError}
            />
          }
        />
        <Route
          path="/trackers/:id"
          element={
            <TrackerDetailPage
              trackers={trackers}
              priceMap={priceMap}
              loading={loading}
              error={trackersError ?? pricesError}
            />
          }
        />
      </Routes>
    </main>
  );
}
