import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
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
  selectReportsError,
  selectStatusMeta,
  selectServicesMeta,
  selectStudentsMeta,
  clearReportsError,
} from "../../store/slices/reportsSlice";
import { SummaryCards } from "../../components/dashboard/SummaryCards";
import { StatusPieChart } from "../../components/dashboard/StatusPieChart";
import { ServicesBarChart } from "../../components/dashboard/ServicesBarChart";
import { StudentsBarChart } from "../../components/dashboard/StudentsBarChart";
import "./AdminDashboard.css";

// ─── Spinner ──────────────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="admin-loading">
      <div className="admin-loading__ring">
        <div />
        <div />
        <div />
        <div />
      </div>
      <p className="admin-loading__text">Loading dashboard data…</p>
    </div>
  );
}

// ─── Error UI ─────────────────────────────────────────────────────────────────

function ErrorBanner({
  message,
  onRetry,
  onDismiss,
}: {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="admin-error">
      <div className="admin-error__icon">⚠️</div>
      <div className="admin-error__body">
        <p className="admin-error__title">Failed to load report data</p>
        <p className="admin-error__message">{message}</p>
      </div>
      <div className="admin-error__actions">
        <button className="admin-error__retry" onClick={onRetry}>
          Retry
        </button>
        <button className="admin-error__dismiss" onClick={onDismiss}>
          ✕
        </button>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export function AdminDashboard() {
  const dispatch = useAppDispatch();

  // ── Selectors ────────────────────────────────────────────────────────────────
  const summary        = useAppSelector(selectReportsSummary);
  const statusReport   = useAppSelector(selectStatusReport);
  const servicesReport = useAppSelector(selectServicesReport);
  const studentsReport = useAppSelector(selectStudentsReport);
  const loading        = useAppSelector(selectReportsLoading);
  const error          = useAppSelector(selectReportsError);
  const statusMeta     = useAppSelector(selectStatusMeta);
  const servicesMeta   = useAppSelector(selectServicesMeta);
  const studentsMeta   = useAppSelector(selectStudentsMeta);

  // ── Pagination local state ────────────────────────────────────────────────
  const [statusPage,   setStatusPage]   = useState(1);
  const [servicesPage, setServicesPage] = useState(1);
  const [studentsPage, setStudentsPage] = useState(1);

  // ── Initial fetch ─────────────────────────────────────────────────────────
  const loadAll = useCallback(() => {
    dispatch(fetchSummary());
    dispatch(fetchStatusReport({ page: statusPage,   limit: 8 }));
    dispatch(fetchServicesReport({ page: servicesPage, limit: 8 }));
    dispatch(fetchStudentsReport({ page: studentsPage, limit: 8 }));
  }, [dispatch, statusPage, servicesPage, studentsPage]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── Pagination handlers ───────────────────────────────────────────────────
  const handleStatusPage = useCallback(
    (page: number) => {
      setStatusPage(page);
      dispatch(fetchStatusReport({ page, limit: 8 }));
    },
    [dispatch]
  );

  const handleServicesPage = useCallback(
    (page: number) => {
      setServicesPage(page);
      dispatch(fetchServicesReport({ page, limit: 8 }));
    },
    [dispatch]
  );

  const handleStudentsPage = useCallback(
    (page: number) => {
      setStudentsPage(page);
      dispatch(fetchStudentsReport({ page, limit: 8 }));
    },
    [dispatch]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="admin-dashboard">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="admin-dashboard__header">
        <div className="admin-dashboard__header-left">
          <div className="admin-dashboard__badge">Admin</div>
          <div>
            <h1 className="admin-dashboard__title">Analytics Dashboard</h1>
            <p className="admin-dashboard__subtitle">
              Real-time overview of requests, services &amp; students
            </p>
          </div>
        </div>
        <button
          className="admin-dashboard__refresh"
          onClick={loadAll}
          title="Refresh all data"
          disabled={loading}
        >
          <span className={loading ? "spin" : ""}>↻</span>
          Refresh
        </button>
      </header>

      {/* ── Error banner ─────────────────────────────────────────────────────── */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={loadAll}
          onDismiss={() => dispatch(clearReportsError())}
        />
      )}

      {/* ── Loading overlay ───────────────────────────────────────────────────── */}
      {loading && !summary && !error && <LoadingSpinner />}

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      {!loading || summary ? (
        <div className="admin-dashboard__content">
          {/* Summary Cards */}
          {summary && (
            <section className="admin-dashboard__section">
              <SummaryCards summary={summary} />
            </section>
          )}

          {/* Charts grid */}
          <section className="admin-dashboard__section">
            <div className="charts-grid">
              {/* Pie chart takes full row on mobile, half on desktop */}
              <div className="charts-grid__pie">
                <StatusPieChart
                  data={statusReport}
                  meta={statusMeta}
                  currentPage={statusPage}
                  onPageChange={handleStatusPage}
                />
              </div>

              {/* Services bar */}
              <div className="charts-grid__bar">
                <ServicesBarChart
                  data={servicesReport}
                  meta={servicesMeta}
                  currentPage={servicesPage}
                  onPageChange={handleServicesPage}
                />
              </div>

              {/* Students bar — full width */}
              <div className="charts-grid__full">
                <StudentsBarChart
                  data={studentsReport}
                  meta={studentsMeta}
                  currentPage={studentsPage}
                  onPageChange={handleStudentsPage}
                />
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
