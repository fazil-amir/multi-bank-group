import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_NAME } from "@shared/constants/app.constants";
import { DEMO_HINT } from "@shared/constants/auth.constants";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-6 rounded-xl border border-border bg-surface">
      <h1 className="text-xl font-bold text-white mb-2">{APP_NAME}</h1>
      <p className="text-muted text-sm mb-6">Sign in to continue</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-3 py-2 rounded-lg bg-canvas border border-border text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="alice@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-muted mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-3 py-2 rounded-lg bg-canvas border border-border text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        {error && (
          <p className="text-negative text-sm" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 px-4 rounded-lg bg-accent text-white font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        <div className="pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => setHintRevealed((v) => !v)}
            className="text-muted text-xs hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 rounded"
          >
            {hintRevealed ? "Hide demo credentials" : "Click to reveal demo credentials"}
          </button>
          {hintRevealed && (
            <ul className="mt-2 text-muted text-xs space-y-1" aria-live="polite">
              {DEMO_HINT.map(({ email: e, password: p }) => (
                <li key={e}>
                  <code className="bg-canvas px-1.5 py-0.5 rounded">{e}</code>
                  {" / "}
                  <code className="bg-canvas px-1.5 py-0.5 rounded">{p}</code>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
      </div>
    </div>
  );
}
