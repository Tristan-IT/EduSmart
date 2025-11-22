import { ReactNode, useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";

export interface DataTableColumn<T> {
  /** Key untuk membaca data dari setiap row. */
  key: keyof T | string;
  /** Teks header kolom. */
  header: string;
  /** Kelas tambahan untuk sel data. */
  className?: string;
  /** Render khusus untuk menampilkan data. */
  render?: (row: T) => ReactNode;
  /** Alignment konten. */
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  sortable?: boolean;
  filters?: ReactNode;
  emptyMessage?: string;
  className?: string;
}

/**
 * Contoh penggunaan:
 * ```tsx
 * <DataTable
 *   columns=[
 *     { key: "name", header: "Nama" },
 *     { key: "score", header: "Skor", align: "right" },
 *   ]
 *   rows=[{ name: "Tristan", score: 92 }]
 *   sortable
 * />
 * ```
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  sortable = false,
  filters,
  emptyMessage = "Belum ada data",
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedRows = useMemo(() => {
    if (!sortable || !sortKey) return rows;

    return [...rows].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortKey];
      const bValue = (b as Record<string, unknown>)[sortKey];

      if (aValue === bValue) return 0;

      const direction = sortDirection === "asc" ? 1 : -1;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction;
      }

      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [rows, sortKey, sortDirection, sortable]);

  const handleSort = (key: string) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const getCellContent = (row: T, column: DataTableColumn<T>): ReactNode => {
    if (column.render) return column.render(row);
    const value = (row as Record<string, unknown>)[column.key as string];
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Ya" : "Tidak";
    return value as ReactNode;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {filters && <div className="flex flex-wrap gap-2">{filters}</div>}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <table className="min-w-full divide-y divide-border/60 text-sm">
          <thead className="bg-muted/60">
            <tr>
              {columns.map((column) => {
                const isSortable = sortable;
                const isActive = sortKey === column.key;
                return (
                  <th
                    key={String(column.key)}
                    scope="col"
                    className={cn(
                      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                    )}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column.key as string)}
                        className="flex items-center gap-1 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {column.header}
                        <ArrowUpDown
                          className={cn(
                            "h-3.5 w-3.5",
                            isActive && sortDirection === "asc" && "rotate-180",
                          )}
                        />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="transition hover:bg-muted/40">
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        "px-4 py-3 text-sm text-foreground",
                        column.className,
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                      )}
                    >
                      {getCellContent(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
