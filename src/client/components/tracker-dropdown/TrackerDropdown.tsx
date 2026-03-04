import { useEffect, useRef, useState } from "react";
import type { PriceMap, TrackerInfo } from "@shared/types/market.types";
import { TrackerOption } from "./TrackerOption";

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={`w-4 h-4 shrink-0 text-muted ${className}`}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

export interface TrackerDropdownProps {
  trackers: TrackerInfo[];
  priceMap: PriceMap;
  value: string;
  onSelect: (id: string) => void;
  priceLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function TrackerDropdown({
  trackers,
  priceMap,
  value,
  onSelect,
  priceLoading = false,
  placeholder = "Select tracker",
  className = "",
}: TrackerDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = value
    ? trackers.find((t) => t.id.toLowerCase() === value.toLowerCase())
    : undefined;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={`relative flex-1 min-w-0 ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center gap-2 py-1.5 px-2.5 rounded-lg bg-canvas border border-border text-left hover:border-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select tracker"
      >
        {selected ? (
          <TrackerOption
            tracker={selected}
            price={priceMap[selected.id.toUpperCase()]}
            priceLoading={priceLoading}
            className="flex-1 min-w-0 py-0 px-0 hover:bg-transparent"
          />
        ) : (
          <span className="flex-1 text-sm text-muted">{placeholder}</span>
        )}
        <ChevronDown className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 max-h-[40vh] overflow-y-auto rounded-lg border border-border bg-surface shadow-lg z-50 scrollbar-theme"
          role="listbox"
        >
          {trackers.map((t) => {
            const isSelected =
              value?.toLowerCase() === t.id.toLowerCase();
            return (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelect(t.id);
                  setOpen(false);
                }}
                className={`w-full text-left border-b border-border last:border-b-0 ${
                  isSelected ? "bg-surface-hover" : ""
                }`}
              >
                <TrackerOption
                  tracker={t}
                  price={priceMap[t.id.toUpperCase()]}
                  priceLoading={priceLoading}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
