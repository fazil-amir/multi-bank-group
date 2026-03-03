import type { CSSProperties, ReactNode } from "react";

export interface ColumnDef<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  align?: "left" | "center" | "right";
  render?: (value: T[keyof T], record: T) => ReactNode;
  cellStyle?: (value: T[keyof T], record: T) => CSSProperties | undefined;
}

export interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: keyof T;
  emptyText?: string;
  onRowClick?: (record: T) => void;
}
