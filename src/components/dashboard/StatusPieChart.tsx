import { useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import { useChartTheme } from "../../util/chartTheme";
import type { StatusReportItem, PaginatedMeta } from "../../store/slices/reportsSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatusPieChartProps {
  data: StatusReportItem[];
  meta: PaginatedMeta | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// ─── Status colour map ────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  pending:   "#f59e0b",
  approved:  "#10b981",
  rejected:  "#ef4444",
  review:    "#6366f1",
  completed: "#06b6d4",
  cancelled: "#94a3b8",
};

function statusColor(status: string): string {
  return STATUS_COLORS[status.toLowerCase()] ?? "#94a3b8";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StatusPieChart({
  data,
  meta,
  currentPage,
  onPageChange,
}: StatusPieChartProps) {
  const theme = useChartTheme();
  const pieData = useMemo(
    () =>
      data.map((item) => ({
        id: item.status,
        label: item.status,
        value: item.count,
        color: statusColor(item.status),
      })),
    [data]
  );

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.count, 0),
    [data]
  );

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card__header">
          <h3 className="chart-card__title">Status Distribution</h3>
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
          <h3 className="chart-card__title">Status Distribution</h3>
          <p className="chart-card__subtitle">
            {total.toLocaleString()} requests across {data.length} statuses
          </p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 340 }}>
        <ResponsivePie
          data={pieData}
          margin={{ top: 24, right: 120, bottom: 24, left: 24 }}
          innerRadius={0.55}
          padAngle={2}
          cornerRadius={4}
          activeOuterRadiusOffset={10}
          colors={(d) => d.data.color}
          borderWidth={0}
          enableArcLinkLabels={false}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#ffffff"
          arcLabelsRadiusOffset={0.6}
          motionConfig="gentle"
          theme={theme}
          legends={[
            {
              anchor: "right",
              direction: "column",
              justify: false,
              translateX: 110,
              translateY: 0,
              itemsSpacing: 10,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: theme.textColor,
              itemDirection: "left-to-right",
              symbolSize: 10,
              symbolShape: "circle",
            },
          ]}
          tooltip={({ datum }) => (
            <div className="chart-tooltip">
              <span
                className="chart-tooltip__dot"
                style={{ background: datum.color as string }}
              />
              <span className="chart-tooltip__label">{datum.label}</span>
              <span className="chart-tooltip__value">{datum.value.toLocaleString()}</span>
            </div>
          )}
        />
      </div>

      {/* Legend tags */}
      <div className="chart-card__tags">
        {data.map((item) => (
          <span
            key={item.status}
            className="chart-tag"
            style={{ borderColor: statusColor(item.status) }}
          >
            <span
              className="chart-tag__dot"
              style={{ background: statusColor(item.status) }}
            />
            {item.status}
            <strong>{item.count}</strong>
          </span>
        ))}
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
            {currentPage} / {meta.totalPages}
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
