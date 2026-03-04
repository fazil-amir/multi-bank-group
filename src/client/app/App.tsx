import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { APP_NAME } from "@shared/constants/app.constants";
import { useAuth } from "../contexts/AuthContext";
import { TrackerDataProvider } from "../contexts/TrackerDataContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { LoginPage } from "../pages/LoginPage";
import { TrackersPage } from "../pages/TrackersPage";
import { TrackerDetailPage } from "../pages/TrackerDetailPage";

function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex items-center justify-between mb-4 sm:mb-8">
      <h1 className="text-xl font-bold text-white sm:text-2xl">
        <Link to="/" className="hover:opacity-90">
          {APP_NAME}
        </Link>
      </h1>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-muted text-sm truncate max-w-[120px] sm:max-w-[200px]">
            {user.email}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm font-medium text-muted hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 rounded px-2 py-1"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
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
              <AppHeader />
              <TrackerDataProvider>
                <Routes>
                  <Route index element={<TrackersPage />} />
                  <Route path="trackers/:id" element={<TrackerDetailPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </TrackerDataProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  );
}
