import { useTheme } from "next-themes";
import { useMemo } from "react";

export const useChartTheme = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return useMemo(
    () => ({
      textColor: isDark ? "#94a3b8" : "#64748b",
      fontSize: 11,
      axis: {
        domain: {
          line: {
            stroke: isDark ? "#334155" : "#e2e8f0",
            strokeWidth: 1,
          },
        },
        legend: {
          text: {
            fill: isDark ? "#cbd5e1" : "#475569",
            fontSize: 12,
            fontWeight: 600,
          },
        },
        ticks: {
          line: {
            stroke: isDark ? "#334155" : "#e2e8f0",
            strokeWidth: 1,
          },
          text: {
            fill: isDark ? "#94a3b8" : "#64748b",
            fontSize: 11,
          },
        },
      },
      grid: {
        line: {
          stroke: isDark ? "#1e293b" : "#f1f5f9",
          strokeWidth: 1,
        },
      },
      annotations: {
        text: {
          fontSize: 13,
          fill: isDark ? "#f8fafc" : "#1e293b",
          outlineWidth: 2,
          outlineColor: isDark ? "#020817" : "#ffffff",
        },
        link: {
          stroke: isDark ? "#334155" : "#e2e8f0",
          strokeWidth: 1,
          outlineWidth: 2,
          outlineColor: isDark ? "#020817" : "#ffffff",
        },
        outline: {
          stroke: isDark ? "#334155" : "#e2e8f0",
          strokeWidth: 2,
          outlineWidth: 2,
          outlineColor: isDark ? "#020817" : "#ffffff",
        },
        symbol: {
          fill: isDark ? "#334155" : "#e2e8f0",
          outlineWidth: 2,
          outlineColor: isDark ? "#020817" : "#ffffff",
        },
      },
      tooltip: {
        container: {
          background: isDark ? "#1e293b" : "#ffffff",
          color: isDark ? "#f8fafc" : "#1e293b",
          fontSize: 12,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        },
      },
    }),
    [isDark]
  );
};
