import { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import type { ServicesReportItem, PaginatedMeta } from "../../store/slices/reportsSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServicesBarChartProps {
  data: ServicesReportItem[];
  meta: PaginatedMeta | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// ─── Colour palette ───────────────────────────────────────────────────────────

const PALETTE = [
  "#6366f1", "#8b5cf6", "#06b6d4", "#10b981",
  "#f59e0b", "#ef4444", "#ec4899", "#14b8a6",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ServicesBarChart({
  data,
  meta,
  currentPage,
  onPageChange,
}: ServicesBarChartProps) {
  const barData = useMemo(
    () =>
      data.map((item, i) => ({
        service: item.serviceName.length > 18
          ? item.serviceName.slice(0, 16) + "…"
          : item.serviceName,
        fullName: item.serviceName,
        count: item.count,
        color: PALETTE[i % PALETTE.length],
      })),
    [data]
  );

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card__header">
          <h3 className="chart-card__title">Services Breakdown</h3>
        </div>
        <div className="chart-card__empty">No data available</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      {/* Header */}
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">Services Breakdown</h3>
          <p className="chart-card__subtitle">
            Requests per service — page {currentPage}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 320 }}>
        <ResponsiveBar
          data={barData}
          keys={["count"]}
          indexBy="service"
          margin={{ top: 16, right: 16, bottom: 80, left: 50 }}
          padding={0.35}
          valueScale={{ type: "linear" }}
          colors={(bar) => (bar.data as { color: string }).color}
          borderRadius={6}
          borderWidth={0}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: -28,
            legend: "",
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            format: (v) => (Number(v) % 1 === 0 ? v : ""),
          }}
          gridYValues={5}
          enableLabel={false}
          motionConfig="gentle"
          theme={{
            axis: {
              ticks: { text: { fill: "#94a3b8", fontSize: 11 } },
            },
            grid: { line: { stroke: "#f1f5f9" } },
          }}
          tooltip={({ indexValue, value, color }) => (
            <div className="chart-tooltip">
              <span className="chart-tooltip__dot" style={{ background: color }} />
              <span className="chart-tooltip__label">{indexValue}</span>
              <span className="chart-tooltip__value">{(value as number).toLocaleString()}</span>
            </div>
          )}
        />
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="chart-pagination">
          <button
            className="chart-pagination__btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ‹
          </button>
          <span className="chart-pagination__info">
            Page {currentPage} of {meta.totalPages}
          </span>
          <button
            className="chart-pagination__btn"
            disabled={currentPage >= meta.totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
