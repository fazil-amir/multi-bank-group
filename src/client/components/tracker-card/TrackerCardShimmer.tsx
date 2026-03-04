export function TrackerCardShimmer() {
  return (
    <div className="bg-surface border border-border rounded-lg py-3 px-3 shadow-sm overflow-hidden sm:rounded-xl sm:py-5 sm:px-5">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="shimmer w-8 h-8 rounded-full shrink-0 sm:w-9 sm:h-9" />
        <div className="flex flex-col min-w-0 flex-1 gap-1 sm:gap-2">
          <div className="shimmer h-3 w-20 rounded sm:h-4 sm:w-24" />
          <div className="shimmer h-2.5 w-14 rounded sm:h-3 sm:w-16" />
        </div>
        <div className="flex flex-col items-end gap-1 ml-auto shrink-0 sm:gap-2">
          <div className="shimmer h-3 w-12 rounded sm:h-4 sm:w-14" />
          <div className="shimmer h-3 w-10 rounded sm:h-4 sm:w-12" />
        </div>
      </div>
    </div>
  );
}
