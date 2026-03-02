const TABLE_HEADERS = ["Symbol", "Price", "High", "Low", "Volume", "Trades", "Side"];
const ROW_COUNT = 8;

export function TableShimmer() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
      <table className="w-full border-collapse text-sm whitespace-nowrap">
        <thead className="bg-surface sticky top-0">
          <tr>
            <th className="py-4 px-5 font-semibold text-muted border-b border-border select-none text-left">
              Symbol
            </th>
            {TABLE_HEADERS.slice(1).map((title) => (
              <th
                key={title}
                className="py-4 px-5 font-semibold text-muted border-b border-border select-none text-right"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROW_COUNT }).map((_, i) => (
            <tr key={i}>
              <td className="py-4 px-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="shimmer w-[22px] h-[22px] rounded-full shrink-0" />
                  <div className="shimmer h-4 w-20 rounded" />
                </div>
              </td>
              <td className="py-4 px-5 border-b border-border text-right">
                <div className="shimmer h-4 w-16 rounded ml-auto" />
              </td>
              <td className="py-4 px-5 border-b border-border text-right">
                <div className="shimmer h-4 w-14 rounded ml-auto" />
              </td>
              <td className="py-4 px-5 border-b border-border text-right">
                <div className="shimmer h-4 w-14 rounded ml-auto" />
              </td>
              <td className="py-4 px-5 border-b border-border text-right">
                <div className="shimmer h-4 w-12 rounded ml-auto" />
              </td>
              <td className="py-4 px-5 border-b border-border text-right">
                <div className="shimmer h-4 w-10 rounded ml-auto" />
              </td>
              <td className="py-4 px-5 border-b border-border text-right">
                <div className="shimmer h-4 w-10 rounded ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
