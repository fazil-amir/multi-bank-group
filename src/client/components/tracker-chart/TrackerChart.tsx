import { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import type { PriceHistoryPoint } from "@shared/types/market.types";

const CHART_LAYOUT = {
  background: { type: ColorType.Solid, color: "#1a1e2f" },
  textColor: "#8b8fa3",
};
const CANDLE_UP = "#00c853";
const CANDLE_DOWN = "#ff4564";

function toCandlestickData(history: PriceHistoryPoint[]) {
  return history.map((p) => ({
    time: Math.floor(p.time / 1000) as UTCTimestamp,
    open: p.open,
    high: p.high,
    low: p.low,
    close: p.close,
  }));
}

export interface TrackerChartProps {
  history: PriceHistoryPoint[];
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export function TrackerChart({
  history,
  loading,
  error,
  className = "",
}: TrackerChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: CHART_LAYOUT,
      grid: {
        vertLines: { color: "#2d3349" },
        horzLines: { color: "#2d3349" },
      },
      rightPriceScale: {
        borderColor: "#2d3349",
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        borderColor: "#2d3349",
        timeVisible: true,
        secondsVisible: false,
      },
      autoSize: true,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: CANDLE_UP,
      downColor: CANDLE_DOWN,
      borderUpColor: CANDLE_UP,
      borderDownColor: CANDLE_DOWN,
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && history.length > 0) {
      seriesRef.current.setData(toCandlestickData(history));
    }
  }, [history]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-canvas/50 text-negative text-sm ${className}`}
      >
        {error}
      </div>
    );
  }

  return (
    <div className={`relative h-full min-h-0 w-full ${className}`}>
      <div ref={containerRef} className="h-full min-h-0 w-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-canvas/70 text-muted text-sm">
          Loading chart…
        </div>
      )}
      {!loading && history.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-canvas/50 text-muted text-sm">
          No history data
        </div>
      )}
    </div>
  );
}
