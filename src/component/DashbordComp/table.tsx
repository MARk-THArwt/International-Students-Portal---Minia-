import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface ColumnConfig<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface ReusableTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  rowsPerPage?: number;
}

export function ReusableTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading,
  title,
  subtitle,
  filters,
  actions,
  rowsPerPage = 5,
}: ReusableTableProps<T>) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  // Pagination calculation
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const visibleData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  // Reset page to 1 if data changes (e.g. after external filtering)
  React.useEffect(() => {
    setPage(1);
  }, [data.length]);

  return (
    <div className="bg-original-card rounded-xl shadow-sm border border-original-border-light overflow-hidden">
      {/* Header Section */}
      {(title || subtitle || filters || actions) && (
        <div className="p-6 border-b border-original-border-light flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-xl font-bold text-original-text-dark">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-original-text-muted mt-1">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Custom Filters (Passed from parent) */}
            {filters}
            
            {/* Action Buttons */}
            {actions}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-original-background-alt/50 border-b border-original-border-light">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-xs font-semibold text-original-text-muted uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-original-border-light">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-original-primary"></div>
                  <p className="mt-2 text-sm text-original-text-muted font-medium">{t("table.loadingData")}</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-original-text-muted italic"
                >
                  {t("table.noRecords")}
                </td>
              </tr>
            ) : (
              visibleData.map((row, rowIndex) => (
                <tr
                  key={row.id || row._id || rowIndex}
                  className="hover:bg-original-background-alt/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-original-text">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && data.length > 0 && (
        <div className="px-6 py-4 border-t border-original-border-light flex items-center justify-between bg-original-background-alt/30">
          <p className="text-sm text-original-text-muted">
            {t("table.showing")}{" "}
            <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span>{" "}
            {t("table.to")}{" "}
            <span className="font-medium">
              {Math.min(page * rowsPerPage, data.length)}
            </span>{" "}
            {t("table.of")}{" "}
            <span className="font-medium">{data.length}</span> {t("table.results")}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-original-border text-original-text-muted disabled:opacity-30 hover:bg-original-card hover:shadow-sm transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
               <span className="text-sm font-semibold text-original-text px-2">
                 {page}
               </span>
               <span className="text-sm text-original-text-muted/70">/</span>
               <span className="text-sm text-original-text-muted/70 px-2">
                 {totalPages}
               </span>
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-original-border text-original-text-muted disabled:opacity-30 hover:bg-original-card hover:shadow-sm transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
