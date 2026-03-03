import { createContext, useContext, type ReactNode } from "react";
import type { PriceMap, TrackerInfo } from "@shared/types/market.types";
import { useLivePrices } from "../hooks/useLivePrices";
import { useTrackers } from "../hooks/useTrackers";

interface TrackerDataContextValue {
  trackers: TrackerInfo[];
  priceMap: PriceMap;
  loading: boolean;
  error: string | null;
}

const TrackerDataContext = createContext<TrackerDataContextValue | null>(null);

export function TrackerDataProvider({ children }: { children: ReactNode }) {
  const { trackers, loading, error: trackersError } = useTrackers();
  const { priceMap, error: pricesError } = useLivePrices();
  const error = trackersError ?? pricesError;

  const value: TrackerDataContextValue = {
    trackers,
    priceMap,
    loading,
    error,
  };

  return (
    <TrackerDataContext.Provider value={value}>
      {children}
    </TrackerDataContext.Provider>
  );
}

export function useTrackerData(): TrackerDataContextValue {
  const ctx = useContext(TrackerDataContext);
  if (!ctx) {
    throw new Error("useTrackerData must be used within TrackerDataProvider");
  }
  return ctx;
}
