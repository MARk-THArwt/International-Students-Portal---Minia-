import { useMemo, useEffect } from "react";
import { Topbar } from "../../component/DashbordComp/Topbar";
import { Card } from "../../component/DashbordComp/Card";
import { CancelButton } from "../../component/DashbordComp/cancelBottom";
import { CreateRequestDropdown } from "../../component/DashbordComp/CreateRequestDropdown";
import {
  ReusableTable,
  type ColumnConfig,
} from "../../component/DashbordComp/table";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";

import {
  selectRequests,
  selectFetchLoading,
} from "../../store/selectors/requestsSelectors";
import { selectUser } from "../../store/slices/authSlice";
import { getMyRequests } from "../../store/AsyncThunks/requestsThunks";
import type { 
  ServiceRequest, 
} from "../../store/types/requestsTypes";

import { useTranslation } from "react-i18next";

export function StudentDashboard() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const requests = useAppSelector(selectRequests);
  const isLoading = useAppSelector(selectFetchLoading);
  const user = useAppSelector(selectUser);
  useEffect(() => {
    if (user) {
      dispatch(getMyRequests({ page: 1, limit: 8 }));
    }
  }, [dispatch, user]);

  const stats = useMemo(() => {
    if (!Array.isArray(requests)) {
      return { total: 0, pending: 0, inReview: 0 };
    }
    const pending = requests.filter((req) => req.status === "Pending").length;
    const inReview = requests.filter(
      (req) => req.status === ("In Review" as any),
    ).length;
    return { total: requests.length, pending, inReview };
  }, [requests]);

  // Map old DashboardTable into new ReusableTable config
  const tableColumns: ColumnConfig<ServiceRequest>[] = useMemo(
    () => [
      {
        key: "request",
        label: t("table.serviceName"),
        render: (row) => (
          <div>
            <p className="font-semibold text-original-text-dark">
              {row.service?.name || t("serviceUnavailable")}
            </p>
            <p className="text-xs text-original-text-muted mt-0.5">ID: {row._id}</p>
          </div>
        ),
      },
      {
        key: "category",
        label: t("dashboardPage.category"),
        render: (row) => (
          <span className="text-original-text">
            {row.service?.name || t("serviceUnavailable")}
          </span>
        ),
      },
      {
        key: "date",
        label: t("table.createdAt"),
        render: (row) => (
          <span className="text-original-text-muted">
            {new Date(row.createdAt).toLocaleDateString(document.documentElement.lang === "ar" ? "ar-EG" : "en-US")}
          </span>
        ),
      },
      {
        key: "status",
        label: t("table.status"),
        render: (row) => {
          const isPending = row.status === "Pending";
          const isApproved = row.status === "Approved";
          const isRejected = row.status === "Rejected";
          
          const colorClass = isPending
            ? "bg-original-warning-light text-original-warning"
            : isApproved
              ? "bg-original-success-light text-original-success"
              : isRejected
                ? "bg-original-danger-light text-original-danger"
                : "bg-original-background-alt text-original-text";
                
          // Camel case for translation key: Pending -> pending
          const statusKey = row.status.charAt(0).toLowerCase() + row.status.slice(1).replace(" ", "");
          const translatedStatus = t(`status.${statusKey}`, { defaultValue: row.status });

          return (
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${colorClass}`}
            >
              {translatedStatus}
            </span>
          );
        },
      },
      {
        key: "actions",
        label: t("table.actions"),
        render: (row) => (
          <CancelButton requestId={row._id} status={row.status} />
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex min-h-screen bg-original-background">
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <Topbar
          title={t("dashboard")}
          showSearch={false}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card
            title={t("dashboardPage.activeRequests")}
            value={isLoading ? "..." : stats.total.toString()}
          >
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="bg-original-warning-light text-original-warning px-2 rounded-full text-xs">
                {stats.pending} {t("status.pending")}
              </span>
              <span className="bg-original-background-alt text-original-primary text-original-primary-hover px-2 rounded-full text-xs">
                {stats.inReview} {t("status.inProgress")}
              </span>
            </div>
          </Card>

          <Card title={t("dashboardPage.outstandingFees")} value="$4,500">
            <p className="text-xs text-original-text-muted">{t("dashboardPage.due")} Oct 15, 2026</p>
            <button className="text-original-primary text-sm mt-2">{t("dashboardPage.payNow")} →</button>
          </Card>

          <Card title={t("dashboardPage.profileStatus")} value="85%">
            <div className="w-full bg-original-background-alt h-2 rounded-full mt-2">
              <div className="bg-original-primary text-white h-2 rounded-full w-[85%]" />
            </div>
          </Card>

          {/* Gradient */}
          <div className="p-4 rounded-xl text-white bg-gradient-to-r from-original-secondary via-original-primary to-original-primary-active shadow-sm flex flex-col justify-center">
            <p className="text-sm font-medium text-original-primary-light">
              {t("dashboardPage.tuitionBalance")}
            </p>
            <h2 className="text-3xl font-bold mt-1">$1,200.00</h2>
            <button className="bg-original-card hover:bg-original-background-alt text-original-primary-hover w-full mt-4 py-2 rounded-lg font-bold transition-colors">
              {t("dashboardPage.payNow")}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          {/* Table */}
          <div className="lg:col-span-2">
            <ReusableTable
              title={t("recentActivity")}
              actions={<CreateRequestDropdown />}
              columns={tableColumns}
              data={Array.isArray(requests) ? requests : []}
              isLoading={isLoading}
            />
          </div>

          {/* Map */}
          <div className="relative h-[160px] rounded-xl overflow-hidden shadow-sm border border-original-border-light bg-[url('https://maps.gstatic.com/tactile/basepage/pegman_sherlock.png')] bg-cover bg-center group">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-3 start-3 text-white">
              <p className="font-bold drop-shadow-md">
                {t("dashboardPage.intlStudentOffice")}
              </p>
              <p className="text-xs font-medium drop-shadow-md mt-0.5">
                {t("dashboardPage.buildingRoom")}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
