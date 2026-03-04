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
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
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

    // Resize after layout so chart gets correct size on mobile first paint (container can be 0 initially)
    const resize = () => chart.resize(container.offsetWidth, container.offsetHeight);
    const resizeId = requestAnimationFrame(resize);
    const timeoutId = window.setTimeout(resize, 150);

    return () => {
      cancelAnimationFrame(resizeId);
      window.clearTimeout(timeoutId);
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
    <div className={`relative flex flex-col h-full min-h-0 w-full min-h-[50vh] md:min-h-0 ${className}`}>
      <div
        ref={containerRef}
        className="h-full w-full min-h-[50vh] md:min-h-0 flex-1"
      />
      <p
        className="p-2 border-t border-border text-sm font-bold shrink-0"
        aria-hidden
      >
        Chart shows 1 year of daily data.
      </p>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-canvas/80">
          <div className="loader-spinner" aria-hidden />
          <span className="text-muted text-sm">Loading chart…</span>
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
