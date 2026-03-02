import type { ColumnDef } from "./Table.types";

interface TableRowProps<T> {
  record: T;
  columns: ColumnDef<T>[];
}

export function TableRow<T>({ record, columns }: TableRowProps<T>) {
  return (
    <tr className="hover:bg-surface-hover">
      {columns.map((col) => {
        const value = record[col.dataIndex];
        const content = col.render ? col.render(value, record) : String(value ?? "");
        const style = col.cellStyle ? col.cellStyle(value, record) : undefined;

        return (
          <td
            key={col.key}
            className={`py-4 px-5 border-b border-border tabular-nums ${
              col.align === "left" ? "text-left" : "text-right"
            }`}
            style={style}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}
