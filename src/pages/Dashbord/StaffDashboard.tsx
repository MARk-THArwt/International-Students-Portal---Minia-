import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle2, XCircle, Timer, Filter, Download, MoreVertical } from "lucide-react";
import { Topbar } from "../../component/DashbordComp/Topbar";
import { ReusableTable, type ColumnConfig } from "../../component/DashbordComp/table";
import { useAppSelector } from "../../store/hooks/hook";
import { selectUser } from "../../store/slices/authSlice";

// ================== TYPES & DUMMY DATA ==================

interface ApplicationRecord {
  id: string;
  studentName: string;
  studentAvatar?: string;
  studentId: string;
  country: string;
  countryCode: string;
  program: string;
  appliedDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

const DUMMY_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "APP-001",
    studentName: "Liam O'Connor",
    studentId: "2026-1042",
    country: "Ireland",
    countryCode: "IE",
    program: "BSc Computer Science",
    appliedDate: "2026-04-28T09:30:00Z",
    status: "Pending",
  },
  {
    id: "APP-002",
    studentName: "Fatima Al-Zahra",
    studentId: "2026-1088",
    country: "UAE",
    countryCode: "AE",
    program: "MSc Artificial Intelligence",
    appliedDate: "2026-04-28T11:15:00Z",
    status: "Approved",
  },
  {
    id: "APP-003",
    studentName: "Chen Wei",
    studentId: "2026-1102",
    country: "China",
    countryCode: "CN",
    program: "BA Business Administration",
    appliedDate: "2026-04-27T14:20:00Z",
    status: "Pending",
  },
  {
    id: "APP-004",
    studentName: "Maria Garcia",
    studentId: "2026-1124",
    country: "Spain",
    countryCode: "ES",
    program: "BSc Engineering",
    appliedDate: "2026-04-27T16:45:00Z",
    status: "Rejected",
  },
  {
    id: "APP-005",
    studentName: "Kwame Osei",
    studentId: "2026-1156",
    country: "Ghana",
    countryCode: "GH",
    program: "MSc Public Health",
    appliedDate: "2026-04-26T10:05:00Z",
    status: "Pending",
  },
];

// ================== DASHBOARD COMPONENT ==================

export function StaffDashboard() {
  const user = useAppSelector(selectUser);

  // Derive simple stats from dummy data for demonstration
  const stats = useMemo(() => {
    return {
      pending: DUMMY_APPLICATIONS.filter((a) => a.status === "Pending").length,
      approvedToday: 12,
      rejectedToday: 3,
      avgProcessingTime: "2.4 Days",
    };
  }, []);

  // Configure Dynamic Columns for the Table
  const tableColumns: ColumnConfig<ApplicationRecord>[] = useMemo(
    () => [
      {
        key: "student",
        label: "Student Name",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
              {row.studentName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{row.studentName}</p>
              <p className="text-xs text-gray-500">ID: {row.studentId}</p>
            </div>
          </div>
        ),
      },
      {
        key: "country",
        label: "Country",
        render: (row) => (
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs overflow-hidden shadow-sm shrink-0">
              <img
                src={`https://flagcdn.com/w20/${row.countryCode.toLowerCase()}.png`}
                alt={row.country}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </span>
            <span className="text-sm text-gray-700">{row.country}</span>
          </div>
        ),
      },
      {
        key: "program",
        label: "Program",
        render: (row) => <span className="text-sm font-medium text-gray-700">{row.program}</span>,
      },
      {
        key: "appliedDate",
        label: "Applied Date",
        render: (row) => (
          <span className="text-sm text-gray-600">
            {new Date(row.appliedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (row) => {
          const styles = {
            Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            Approved: "bg-green-100 text-green-700 border-green-200",
            Rejected: "bg-red-100 text-red-700 border-red-200",
          };
          return (
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[row.status]}`}
            >
              {row.status}
            </span>
          );
        },
      },
      {
        key: "actions",
        label: "Action",
        render: () => (
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-semibold transition-colors">
              Review
            </button>
            <button className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-md transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Fallback UI if not logged in
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full">
          <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-500 mt-2 text-sm">Please log in to access the Staff Dashboard.</p>
          <Link
            to="/Login"
            className="mt-6 inline-block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <Topbar title="Staff Overview" showSearch={true} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full flex items-center gap-1">
                ↑ 12%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Requests</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                ↑ 8%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Approved Today</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.approvedToday}</h3>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded-full flex items-center gap-1">
                ↓ 2%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Rejected Today</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.rejectedToday}</h3>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                ↓ 5%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Avg Processing Time</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.avgProcessingTime}</h3>
          </div>
        </div>

        {/* Dynamic Reusable Table Section */}
        <ReusableTable
          title="Processing Queue"
          subtitle="Latest international student applications requiring review"
          columns={tableColumns}
          data={DUMMY_APPLICATIONS}
          isLoading={false}
          actions={
            <>
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
            </>
          }
        />
      </main>
    </div>
  );
}
