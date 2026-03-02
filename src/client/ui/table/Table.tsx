import type { TableProps } from "./Table.types";
import { TableRow } from "./TableRow";

export function Table<T>({ columns, data, rowKey, emptyText }: TableProps<T>) {
  if (data.length === 0) {
    return <p className="text-muted py-5 text-sm">{emptyText ?? "No data"}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
      <table className="w-full border-collapse text-sm whitespace-nowrap">
        <thead className="bg-surface sticky top-0">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-4 px-5 font-semibold text-muted border-b border-border select-none ${
                  col.align === "left" ? "text-left" : "text-right"
                }`}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <TableRow key={String(record[rowKey])} record={record} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
