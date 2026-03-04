import { Navigate, Route, Routes } from "react-router-dom";
import { TrackerDataProvider } from "../contexts/TrackerDataContext";
import { ProtectedRoute } from "../components/protected-route";
import { AppHeader } from "../components/app-header";
import { LoginPage } from "../pages/LoginPage";
import { TrackersPage } from "../pages/TrackersPage";
import { TrackerDetailPage } from "../pages/TrackerDetailPage";

function ProtectedLayout() {
  return (
    <>
      <AppHeader />
      <TrackerDataProvider>
        <Routes>
          <Route index element={<TrackersPage />} />
          <Route path="trackers/:id" element={<TrackerDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TrackerDataProvider>
    </>
  );
}

export default function App() {
  return (
    <main className="max-w-[1600px] mx-auto px-4 py-5 sm:px-6 sm:py-10 md:px-10">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  );
}
