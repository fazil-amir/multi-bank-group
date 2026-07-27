import { Link } from "react-router-dom";
import { APP_NAME, APP_INITIALS } from "@shared/constants/app.constants";

export function AppHeader() {
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
    </header>
  );
}
