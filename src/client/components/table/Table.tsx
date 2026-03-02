import type { TableProps } from "./Table.types";
import { TableRow } from "./TableRow";

export function Table<T>({ columns, data, rowKey, emptyText }: TableProps<T>) {
  if (data.length === 0) {
    return <p className="loading">{emptyText ?? "No data"}</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: col.align ?? "right" }}>
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
