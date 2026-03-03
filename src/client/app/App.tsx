import { Link, Route, Routes } from "react-router-dom";
import { APP_NAME } from "@shared/constants/app.constants";
import { TrackerDataProvider } from "../contexts/TrackerDataContext";
import { TrackersPage } from "../pages/TrackersPage";
import { TrackerDetailPage } from "../pages/TrackerDetailPage";

export default function App() {
  return (
    <main className="max-w-[1600px] mx-auto px-4 py-5 sm:px-6 sm:py-10 md:px-10">
      <h1 className="text-xl font-bold mb-4 text-white sm:text-2xl sm:mb-8">
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
