import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Filter, Download } from "lucide-react";

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
  actions?: React.ReactNode;
}

export function ReusableTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading,
  title,
  subtitle,
  actions,
}: ReusableTableProps<T>) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const visibleData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header Section */}
      {(title || subtitle || actions) && (
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading data...</p>
                </td>
              </tr>
            ) : visibleData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              visibleData.map((row, rowIndex) => (
                <tr key={row.id || row._id || rowIndex} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && data.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{" "}
            <span className="font-medium">{Math.min(page * rowsPerPage, data.length)}</span> of{" "}
            <span className="font-medium">{data.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
