import type { ColumnDef } from "./Table.types";

interface TableRowProps<T> {
  record: T;
  columns: ColumnDef<T>[];
}

export function TableRow<T>({ record, columns }: TableRowProps<T>) {
  return (
    <tr>
      {columns.map((col) => {
        const value = record[col.dataIndex];
        const content = col.render ? col.render(value, record) : String(value ?? "");
        const style = col.cellStyle ? col.cellStyle(value, record) : undefined;

        return (
          <td key={col.key} style={{ textAlign: col.align ?? "right", ...style }}>
            {content}
          </td>
        );
      })}
    </tr>
  );
}
