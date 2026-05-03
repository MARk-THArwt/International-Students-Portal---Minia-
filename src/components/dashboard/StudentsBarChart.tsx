import { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import type { StudentsReportItem, PaginatedMeta } from "../../store/slices/reportsSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentsBarChartProps {
  data: StudentsReportItem[];
  meta: PaginatedMeta | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// ─── Colour palette ───────────────────────────────────────────────────────────

const PALETTE = [
  "#f093fb", "#f5576c", "#4facfe", "#00f2fe",
  "#43e97b", "#38f9d7", "#fa709a", "#fee140",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function StudentsBarChart({
  data,
  meta,
  currentPage,
  onPageChange,
}: StudentsBarChartProps) {
  const barData = useMemo(
    () =>
      data.map((item, i) => ({
        student: item.studentName.length > 16
          ? item.studentName.slice(0, 14) + "…"
          : item.studentName,
        fullName: item.studentName,
        count: item.count,
        color: PALETTE[i % PALETTE.length],
      })),
    [data]
  );

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card__header">
          <h3 className="chart-card__title">Top Students</h3>
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
          <h3 className="chart-card__title">Top Students by Requests</h3>
          <p className="chart-card__subtitle">
            Showing {data.length} students — page {currentPage}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 320 }}>
        <ResponsiveBar
          data={barData}
          keys={["count"]}
          indexBy="student"
          layout="horizontal"
          margin={{ top: 16, right: 60, bottom: 24, left: 120 }}
          padding={0.35}
          valueScale={{ type: "linear" }}
          colors={(bar) => (bar.data as { color: string }).color}
          borderRadius={6}
          borderWidth={0}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            format: (v) => (Number(v) % 1 === 0 ? v : ""),
          }}
          gridXValues={5}
          enableLabel={true}
          labelSkipWidth={32}
          labelTextColor="#ffffff"
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
