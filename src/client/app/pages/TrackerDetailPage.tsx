import { Link, useParams } from "react-router-dom";
import type { PriceMap, TrackerInfo } from "@shared/types/market.types";
import { TrackerCard } from "../../components/tracker-card";

export interface TrackerDetailPageProps {
  trackers: TrackerInfo[];
  priceMap: PriceMap;
  loading: boolean;
  error: string | null;
}

export function TrackerDetailPage({ trackers, priceMap, loading, error }: TrackerDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const tracker = id ? trackers.find((t) => t.id.toLowerCase() === id.toLowerCase()) : undefined;
  const price = tracker ? priceMap[tracker.id.toUpperCase()] : undefined;

  if (loading) {
    return <p className="text-muted py-8 text-sm">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-negative py-4 px-4 bg-surface border border-negative rounded-lg text-sm">
        {error}
      </p>
    );
  }

  if (!tracker) {
    return (
      <div>
        <Link
          to="/"
          className="inline-block text-accent hover:underline mb-4 text-sm font-medium"
        >
          ← Back to Trackers
        </Link>
        <p className="text-muted">Tracker not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/"
        className="inline-block text-accent hover:underline mb-6 text-sm font-medium"
      >
        ← Back to Trackers
      </Link>
      <h2 className="text-lg font-semibold text-accent mb-5">{tracker.name}</h2>
      <div className="max-w-md">
        <TrackerCard tracker={tracker} price={price} />
      </div>
    </div>
  );
}
