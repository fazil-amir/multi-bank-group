import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_NAME, APP_INITIALS } from "@shared/constants/app.constants";
import { useAuth } from "../../contexts/AuthContext";

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  async function handleSignOut() {
    await logout();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between mb-4 sm:mb-6 py-3 sm:py-3.5 px-4 sm:px-5 rounded-xl bg-surface/95 backdrop-blur-sm shadow-sm border border-border/50 min-w-0">
      <h1 className="text-xl font-bold text-white sm:text-lg md:text-xl min-w-0">
        <Link
          to="/"
          className="hover:opacity-90 flex items-center gap-2 sm:gap-3"
        >
          <span className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-accent/20 text-accent font-bold text-sm shrink-0">
            {APP_INITIALS}
          </span>
          <span className="sm:hidden font-semibold text-white">
            {APP_INITIALS}
          </span>
          <span className="hidden sm:inline font-semibold text-white truncate">
            {APP_NAME}
          </span>
        </Link>
      </h1>

      {/* Desktop: app-style user bar */}
      <div className="hidden sm:flex items-center gap-3 md:gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-semibold shrink-0"
            title={user.email}
          >
            {user.email.slice(0, 2).toUpperCase()}
          </span>
          <span className="text-sm text-muted truncate max-w-[180px] md:max-w-[220px]">
            {user.email}
          </span>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-sm font-medium text-muted hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-lg px-4 py-2 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Mobile: menu button + dropdown */}
      <div className="relative sm:hidden" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="p-2 rounded-lg text-muted hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50"
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-1 py-2 min-w-[180px] rounded-lg border border-border bg-surface shadow-lg z-10"
            role="menu"
          >
            <div className="px-4 py-2 border-b border-border">
              <p className="text-xs text-muted uppercase tracking-wide">Signed in as</p>
              <p className="text-sm text-white truncate mt-0.5">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleSignOut();
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-muted hover:text-accent hover:bg-white/5 focus:outline-none focus:bg-white/5"
              role="menuitem"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
