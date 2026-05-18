import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hook";
import {
  fetchSummary,
  fetchStatusReport,
  fetchServicesReport,
  fetchStudentsReport,
  selectReportsSummary,
  selectStatusReport,
  selectServicesReport,
  selectStudentsReport,
  selectReportsLoading,
} from "@/store/slices/reportsSlice";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import {
  IconFileText,
  IconUsers,
  IconTools,
  IconTrendingUp,
  IconChartPie,
  IconChartBar,
  IconAward,
  IconLoader2,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

// ─── Chart Theme Hook ─────────────────────────────────────────────────────────
function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return {
    isDark,
    theme: {
      background: "transparent",
      textColor: isDark ? "#94A3B8" : "#475569",
      fontSize: 12,
      axis: {
        domain: { line: { stroke: isDark ? "#1E293B" : "#E2E8F0", strokeWidth: 1 } },
        ticks: {
          line: { stroke: isDark ? "#1E293B" : "#E2E8F0", strokeWidth: 1 },
          text: { fill: isDark ? "#94A3B8" : "#475569", fontSize: 11 },
        },
        legend: { text: { fill: isDark ? "#94A3B8" : "#475569", fontSize: 12 } },
      },
      grid: { line: { stroke: isDark ? "#1E293B" : "#F1F5F9", strokeWidth: 1 } },
      legends: { text: { fill: isDark ? "#94A3B8" : "#475569", fontSize: 12 } },
      tooltip: {
        container: {
          background: isDark ? "#111827" : "#ffffff",
          color: isDark ? "#F8FAFC" : "#1e293b",
          fontSize: 13,
          borderRadius: "10px",
          border: `1px solid ${isDark ? "#1E293B" : "#E2E8F0"}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        },
      },
    },
  };
}

// ─── Status colors map ─────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  approved: "#22C55E",
  rejected: "#EF4444",
  cancelled: "#94A3B8",
  completed: "#4F6BFF",
  processing: "#A855F7",
};

// ─── Summary card component ────────────────────────────────────────────────────
function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
  desc,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  desc: string;
}) {
  return (
    <div className="bg-original-card rounded-2xl border border-original-border p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest uppercase text-original-text-muted">
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: color + "22" }}
        >
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="text-4xl font-black" style={{ color }}>
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-original-text-muted leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
function Section({
  title,
  desc,
  icon: Icon,
  children,
}: {
  title: string;
  desc: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-original-card rounded-2xl border border-original-border shadow-sm overflow-hidden">
      {/* header */}
      <div className="flex items-start gap-3 px-6 py-5 border-b border-original-border">
        <div className="w-9 h-9 rounded-xl bg-original-primary-subtle flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={18} className="text-original-primary" />
        </div>
        <div>
          <h3 className="text-base font-bold text-original-text-dark">{title}</h3>
          <p className="text-xs text-original-text-muted mt-0.5 max-w-lg leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Status legend row ─────────────────────────────────────────────────────────
function StatusLegend({
  status,
  count,
  total,
  t,
}: {
  status: string;
  count: number;
  total: number;
  t: any;
}) {
  const color = STATUS_COLORS[status.toLowerCase()] ?? "#94A3B8";
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const label = t(`reportsPage.statusLabels.${status.toLowerCase()}`, { defaultValue: status });
  const desc = t(`reportsPage.statusDescriptions.${status.toLowerCase()}`, { defaultValue: "" });

  return (
    <div className="flex items-center gap-3">
      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-original-text truncate">
            {label}
          </span>
          <span className="text-xs font-bold text-original-text-muted ms-2 shrink-0">
            {count} ({pct}%)
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-original-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <p className="text-[10px] text-original-text-muted mt-1 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminReports() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const summary = useAppSelector(selectReportsSummary);
  const statusReport = useAppSelector(selectStatusReport);
  const servicesReport = useAppSelector(selectServicesReport);
  const studentsReport = useAppSelector(selectStudentsReport);
  const loading = useAppSelector(selectReportsLoading);
  const { theme, isDark } = useChartTheme();

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchStatusReport({ page: 1, limit: 20 }));
    dispatch(fetchServicesReport({ page: 1, limit: 10 }));
    dispatch(fetchStudentsReport({ page: 1, limit: 10 }));
  }, [dispatch]);

  // ── Pie chart data ──────────────────────────────────────────────────────────
  const pieData = statusReport.map((item) => ({
    id: t(`reportsPage.statusLabels.${item.status.toLowerCase()}`, { defaultValue: item.status }),
    label: t(`reportsPage.statusLabels.${item.status.toLowerCase()}`, { defaultValue: item.status }),
    value: item.count,
    color: STATUS_COLORS[item.status.toLowerCase()] ?? "#94A3B8",
  }));

  // ── Bar chart data — services ───────────────────────────────────────────────
  const barData = servicesReport.map((item) => ({
    service: item.serviceName.length > 18 ? item.serviceName.slice(0, 18) + "…" : item.serviceName,
    [t("reportsPage.count")]: item.count,
  }));

  // ── Bar chart data — top students ───────────────────────────────────────────
  const studentsBarData = studentsReport.map((item) => ({
    student: item.studentName.length > 16 ? item.studentName.slice(0, 16) + "…" : item.studentName,
    [t("reportsPage.count")]: item.count,
  }));

  const totalRequests = statusReport.reduce((s, i) => s + i.count, 0);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3 text-original-text-muted">
          <IconLoader2 size={36} className="animate-spin text-original-primary" />
          <p className="text-sm font-medium">{t("reportsPage.fetching")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-original-background p-4 sm:p-6 lg:p-8">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-6 rounded-full bg-original-primary" />
          <h1 className="text-2xl font-black text-original-text-dark">{t("reportsPage.title")}</h1>
        </div>
        <p className="text-sm text-original-text-muted ms-3 max-w-xl">
          {t("reportsPage.subtitle")}
        </p>
      </div>

      {/* ── Summary KPI Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          label={t("reportsPage.totalRequests")}
          value={summary?.totalRequests ?? 0}
          icon={IconFileText}
          color="#4F6BFF"
          desc={t("reportsPage.totalRequestsDesc")}
        />
        <SummaryCard
          label={t("reportsPage.availableServices")}
          value={summary?.totalServices ?? 0}
          icon={IconTools}
          color="#D4A94D"
          desc={t("reportsPage.availableServicesDesc")}
        />
        <SummaryCard
          label={t("reportsPage.registeredStudents")}
          value={summary?.totalStudents ?? 0}
          icon={IconUsers}
          color="#22C55E"
          desc={t("reportsPage.registeredStudentsDesc")}
        />
      </div>

      {/* ── Status Section ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie chart */}
        <Section
          title={t("reportsPage.requestsByStatus")}
          desc={t("reportsPage.requestsByStatusDesc")}
          icon={IconChartPie}
        >
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsivePie
                data={pieData}
                theme={theme}
                margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
                innerRadius={0.55}
                padAngle={0.7}
                cornerRadius={4}
                colors={{ datum: "data.color" }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
                enableArcLinkLabels={false}
                arcLabel={(d) => `${d.value}`}
                arcLabelsTextColor="#fff"
                arcLabelsSkipAngle={12}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-original-text-muted text-sm">
                {t("reportsPage.noData")}
              </div>
            )}
          </div>
        </Section>

        {/* Status legend with details */}
        <Section
          title={t("reportsPage.statusDetails")}
          desc={t("reportsPage.statusDetailsDesc")}
          icon={IconTrendingUp}
        >
          <div className="flex flex-col gap-4">
            {statusReport.length > 0 ? (
              statusReport.map((item) => (
                <StatusLegend
                  key={item.status}
                  status={item.status}
                  count={item.count}
                  total={totalRequests}
                  t={t}
                />
              ))
            ) : (
              <p className="text-sm text-original-text-muted text-center py-8">{t("reportsPage.noData")}</p>
            )}
          </div>
        </Section>
      </div>

      {/* ── Services Bar Chart ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <Section
          title={t("reportsPage.mostRequestedServices")}
          desc={t("reportsPage.mostRequestedServicesDesc")}
          icon={IconChartBar}
        >
          <div className="h-72">
            {barData.length > 0 ? (
              <ResponsiveBar
                data={barData}
                keys={[t("reportsPage.count")]}
                indexBy="service"
                theme={theme}
                margin={{ top: 10, right: 20, bottom: 70, left: 50 }}
                padding={0.35}
                colors={["#4F6BFF"]}
                borderRadius={6}
                axisBottom={{
                  tickRotation: -35,
                  legend: t("reportsPage.service"),
                  legendPosition: "middle",
                  legendOffset: 60,
                }}
                axisLeft={{
                  tickSize: 4,
                  tickPadding: 6,
                  legend: t("reportsPage.count"),
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                enableGridX={false}
                animate
              />
            ) : (
              <div className="flex items-center justify-center h-full text-original-text-muted text-sm">
                {t("reportsPage.noData")}
              </div>
            )}
          </div>

          {/* services detail table */}
          {servicesReport.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-original-border">
                    <th className="text-start py-2 px-3 text-[11px] font-bold uppercase tracking-widest text-original-text-muted">#</th>
                    <th className="text-start py-2 px-3 text-[11px] font-bold uppercase tracking-widest text-original-text-muted">{t("reportsPage.service")}</th>
                    <th className="text-end py-2 px-3 text-[11px] font-bold uppercase tracking-widest text-original-text-muted">{t("reportsPage.count")}</th>
                    <th className="text-end py-2 px-3 text-[11px] font-bold uppercase tracking-widest text-original-text-muted">{t("reportsPage.percentage")}</th>
                  </tr>
                </thead>
                <tbody>
                  {servicesReport.map((item, i) => {
                    const total = servicesReport.reduce((s, r) => s + r.count, 0);
                    const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
                    return (
                      <tr
                        key={item._id}
                        className="border-b border-original-border/50 hover:bg-original-background-alt transition-colors"
                      >
                        <td className="py-2.5 px-3 text-original-text-muted font-mono text-xs">{i + 1}</td>
                        <td className="py-2.5 px-3 font-medium text-original-text">{item.serviceName}</td>
                        <td className="py-2.5 px-3 text-end">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-original-primary-subtle text-original-primary">
                            {item.count}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-end text-original-text-muted text-xs font-medium">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>

      {/* ── Top Students Bar Chart ──────────────────────────────────────────── */}
      <div className="mb-6">
        <Section
          title={t("reportsPage.topStudents")}
          desc={t("reportsPage.topStudentsDesc")}
          icon={IconAward}
        >
          <div className="h-72">
            {studentsBarData.length > 0 ? (
              <ResponsiveBar
                data={studentsBarData}
                keys={[t("reportsPage.count")]}
                indexBy="student"
                theme={theme}
                margin={{ top: 10, right: 20, bottom: 70, left: 50 }}
                padding={0.35}
                colors={[isDark ? "#D4A94D" : "#C5A059"]}
                borderRadius={6}
                axisBottom={{
                  tickRotation: -30,
                  legend: t("reportsPage.student"),
                  legendPosition: "middle",
                  legendOffset: 60,
                }}
                axisLeft={{
                  tickSize: 4,
                  tickPadding: 6,
                  legend: t("reportsPage.count"),
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
                enableGridX={false}
                animate
              />
            ) : (
              <div className="flex items-center justify-center h-full text-original-text-muted text-sm">
                {t("reportsPage.noData")}
              </div>
            )}
          </div>

          {/* students detail table */}
          {studentsReport.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-original-border">
                    <th className="text-start py-2 px-3 text-[11px] font-bold uppercase tracking-widest text-original-text-muted">#</th>
                    <th className="text-start py-2 px-3 text-[11px] font-bold uppercase tracking-widest text-original-text-muted">{t("reportsPage.student")}</th>
                    <th className="text-end py-2 px-3 text-[11px] font-bold uppercase tracking-widest text-original-text-muted">{t("reportsPage.count")}</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsReport.map((item, i) => (
                    <tr
                      key={item._id}
                      className="border-b border-original-border/50 hover:bg-original-background-alt transition-colors"
                    >
                      <td className="py-2.5 px-3 text-original-text-muted font-mono text-xs">{i + 1}</td>
                      <td className="py-2.5 px-3 font-medium text-original-text">{item.studentName}</td>
                      <td className="py-2.5 px-3 text-end">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-original-accent-subtle text-original-accent">
                          {item.count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
