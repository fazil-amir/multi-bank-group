import type { ColumnDef } from "./Table.types";

interface TableRowProps<T> {
  record: T;
  columns: ColumnDef<T>[];
  onRowClick?: (record: T) => void;
}

export function TableRow<T>({ record, columns, onRowClick }: TableRowProps<T>) {
  return (
    <tr
      className={onRowClick ? "hover:bg-surface-hover cursor-pointer" : "hover:bg-surface-hover"}
      onClick={onRowClick ? () => onRowClick(record) : undefined}
      role={onRowClick ? "button" : undefined}
    >
      {columns.map((col) => {
        const value = record[col.dataIndex];
        const content = col.render ? col.render(value, record) : String(value ?? "");
        const style = col.cellStyle ? col.cellStyle(value, record) : undefined;

        return (
          <td
            key={col.key}
            className={`py-2.5 px-3 border-b border-border tabular-nums sm:py-4 sm:px-5 ${
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
