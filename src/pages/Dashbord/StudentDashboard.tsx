import { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Topbar } from "../../component/DashbordComp/Topbar";
import { Card } from "../../component/DashbordComp/Card";
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
import { Button } from "@/components/ui/button";

// Local types for requests
interface ServiceRequest {
  _id: string;
  service: { name: string };
  status: string;
  createdAt: string;
}

export function StudentDashboard() {
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
        label: "REQUEST / ACTION",
        render: (row) => (
          <div>
            <p className="font-semibold text-gray-900">
              {row.service?.name || "Unknown Service"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">ID: {row._id}</p>
          </div>
        ),
      },
      {
        key: "category",
        label: "CATEGORY",
        render: (row) => (
          <span className="text-gray-700">
            {row.service?.name || "General"}
          </span>
        ),
      },
      {
        key: "date",
        label: "DATE",
        render: (row) => (
          <span className="text-gray-600">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: "status",
        label: "STATUS",
        render: (row) => {
          const isPending =
            row.status === "Pending" || row.status === "In Review";
          const isSuccess =
            row.status === "Approved" || row.status === "Success";
          const colorClass = isPending
            ? "bg-yellow-100 text-yellow-800"
            : isSuccess
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800";
          return (
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${colorClass}`}
            >
              {row.status}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <Topbar
          title="Student Dashboard"
          showSearch={false}
          subtitle={`Welcome back, ${user?.name}! Here are your recent requests.`}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card
            title="ACTIVE REQUESTS"
            value={isLoading ? "..." : stats.total.toString()}
          >
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="bg-yellow-100 text-yellow-700 px-2 rounded-full text-xs">
                {stats.pending} Pending
              </span>
              <span className="bg-blue-100 text-blue-700 px-2 rounded-full text-xs">
                {stats.inReview} In Review
              </span>
            </div>
          </Card>

          <Card title="OUTSTANDING FEES" value="$4,500">
            <p className="text-xs text-gray-500">Due Oct 15, 2026</p>
            <button className="text-blue-600 text-sm mt-2">PAY NOW →</button>
          </Card>

          <Card title="PROFILE STATUS" value="85%">
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div className="bg-blue-600 h-2 rounded-full w-[85%]" />
            </div>
          </Card>

          {/* Gradient */}
          <div className="p-4 rounded-xl text-white bg-gradient-to-r from-blue-900 to-blue-600 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-medium text-blue-100">
              Tuition Balance Due
            </p>
            <h2 className="text-3xl font-bold mt-1">$1,200.00</h2>
            <button className="bg-white hover:bg-gray-50 text-blue-700 w-full mt-4 py-2 rounded-lg font-bold transition-colors">
              Pay Now
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          {/* Table */}
          <div className="lg:col-span-2">
            <ReusableTable
              title="Recent Activity"
              actions={
                <Button
                  asChild
                  variant={"default"}
                  className="will-change-transform bg-[#0A1931] hover:bg-[#0A1931]/90! active:scale-97 text-center"
                >
                  <Link to="/newRequest">Create Request</Link>
                </Button>
              }
              columns={tableColumns}
              data={Array.isArray(requests) ? requests : []}
              isLoading={isLoading}
            />
          </div>

          {/* Map */}
          <div className="relative h-[160px] rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-[url('https://maps.gstatic.com/tactile/basepage/pegman_sherlock.png')] bg-cover bg-center group">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-3 left-3 text-white">
              <p className="font-bold drop-shadow-md">
                International Student Office
              </p>
              <p className="text-xs font-medium drop-shadow-md mt-0.5">
                Building C, Room 204
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
