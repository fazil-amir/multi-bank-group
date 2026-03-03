import { Link, Route, Routes } from "react-router-dom";
import { APP_NAME } from "@shared/constants/app.constants";
import { TrackerDataProvider } from "../contexts/TrackerDataContext";
import { TrackersPage } from "../pages/TrackersPage";
import { TrackerDetailPage } from "../pages/TrackerDetailPage";

export default function App() {
  return (
    <main className="max-w-[1600px] mx-auto px-6 py-10 sm:px-10">
      <h1 className="text-2xl font-bold mb-8 text-white">
        <Link to="/" className="hover:opacity-90">
          {APP_NAME}
        </Link>
      </h1>
      <TrackerDataProvider>
        <Routes>
          <Route path="/" element={<TrackersPage />} />
          <Route path="/trackers/:id" element={<TrackerDetailPage />} />
        </Routes>
      </TrackerDataProvider>
    </main>
  );
}
