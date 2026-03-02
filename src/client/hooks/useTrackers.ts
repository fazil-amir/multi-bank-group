import { useEffect, useState } from "react";
import { ENDPOINTS } from "@shared/constants/api.constants";
import type { TrackerInfo } from "@shared/types/market.types";
import { apiFetch } from "@shared/utils/fetch.utils";

export function useTrackers(): {
  trackers: TrackerInfo[];
  loading: boolean;
  error: string | null;
} {
  const [trackers, setTrackers] = useState<TrackerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<TrackerInfo[]>(ENDPOINTS.TRACKERS_SYMBOLS)
      .then(setTrackers)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { trackers, loading, error };
}
