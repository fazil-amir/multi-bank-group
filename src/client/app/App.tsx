import { Link, Route, Routes } from "react-router-dom";
import { APP_NAME } from "@shared/constants/app.constants";
import { TrackersPage } from "./pages/TrackersPage";
import { TrackerDetailPage } from "./pages/TrackerDetailPage";

export default function App() {
  return (
    <main className="max-w-[1400px] mx-auto px-10 py-10">
      <h1 className="text-2xl font-bold mb-8 text-white">
        <Link to="/trackers" className="hover:opacity-90">
          {APP_NAME}
        </Link>
      </h1>
      <Routes>
        <Route path="/" element={<TrackersPage />} />
        <Route path="/trackers" element={<TrackersPage />} />
        <Route path="/trackers/:id" element={<TrackerDetailPage />} />
      </Routes>
    </main>
  );
}
