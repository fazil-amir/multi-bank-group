function TriangleUp() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="currentColor"
      className="shrink-0"
      aria-hidden
    >
      <path d="M4 1L7 6H1L4 1Z" />
    </svg>
  );
}

function TriangleDown() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="currentColor"
      className="shrink-0"
      aria-hidden
    >
      <path d="M4 7L1 2h6L4 7Z" />
    </svg>
  );
}

export interface ChangeBadgeProps {
  changePercent: number;
  className?: string;
}

export function ChangeBadge({ changePercent, className = "" }: ChangeBadgeProps) {
  const isUp = changePercent > 0;
  const isDown = changePercent < 0;
  const text =
    isUp ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${className} ${
        isUp
          ? "bg-positive text-white"
          : isDown
            ? "bg-negative text-white"
            : "bg-muted text-white"
      }`}
    >
      {isUp && <TriangleUp />}
      {isDown && <TriangleDown />}
      {text}
    </span>
  );
}
