export function TrackerCardShimmer() {
  return (
    <div className="bg-surface border border-border rounded-xl py-5 px-5 shadow-sm overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="shimmer w-9 h-9 rounded-full shrink-0" />
        <div className="flex flex-col min-w-0 flex-1 gap-2">
          <div className="shimmer h-4 w-24 rounded" />
          <div className="shimmer h-3 w-16 rounded" />
        </div>
        <div className="flex flex-col items-end gap-2 ml-auto shrink-0">
          <div className="shimmer h-4 w-14 rounded" />
          <div className="shimmer h-4 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}
