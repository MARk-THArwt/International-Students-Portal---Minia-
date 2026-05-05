import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, XCircle, Timer, Filter, Download, MoreVertical, Loader2, AlertCircle, Eye, Check, X } from "lucide-react";
import { Topbar } from "../../component/DashbordComp/Topbar";
import { ReusableTable, type ColumnConfig } from "../../component/DashbordComp/table";
import { useAppSelector, useAppDispatch } from "../../store/hooks/hook";
import { selectUser } from "../../store/slices/authSlice";
import { getAllRequests, reviewRequest } from "../../store/AsyncThunks/requestsThunks";
import type { ServiceRequest, RequestStatus } from "../../store/types/requestsTypes";
import { exportToExcel } from "../../util/exportToExcel";

// ================== DASHBOARD COMPONENT ==================

export function StaffDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const { requests, loading, error } = useAppSelector((state) => state.requests);
  
  // Review Form State
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<RequestStatus>("Pending");
  const [reviewNotes, setReviewNotes] = useState("");
  
  // Table Filtering State
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    dispatch(getAllRequests({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleOpenReview = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setReviewStatus(request.status);
    setReviewNotes(request.reviewNotes || "");
    setIsReviewModalOpen(true);
  };

  const handleCloseReview = () => {
    setIsReviewModalOpen(false);
    setSelectedRequest(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      await dispatch(reviewRequest({
        requestId: selectedRequest._id,
        status: reviewStatus as any,
        reviewNotes: reviewNotes
      })).unwrap();
      
      handleCloseReview();
      // Optionally show success message here
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  const handleExport = () => {
    const exportData = filteredRequests.map((req) => ({
      "Student Name": req.student?.name || "N/A",
      "Email": req.student?.email || "N/A",
      "Service Name": req.service?.name || "N/A",
      "Category": req.category || req.service?.category || "N/A",
      "Status": req.status,
      "Documents Count": req.requiredDocuments?.length || 0,
      "Created At": req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "N/A",
    }));

    exportToExcel(exportData, `Requests_Export_${new Date().toISOString().split('T')[0]}`, "Requests");
  };

  // Derive filtered requests
  const filteredRequests = useMemo(() => {
    if (statusFilter === "All") return requests;
    return requests.filter((req) => req.status === statusFilter);
  }, [requests, statusFilter]);

  // Derive simple stats for demonstration
  const stats = useMemo(() => {
    return {
      pending: requests.filter((a) => a.status === "Pending").length,
      approvedToday: requests.filter((a) => a.status === "Approved").length,
      rejectedToday: requests.filter((a) => a.status === "Rejected").length,
      avgProcessingTime: "2.4 Days",
    };
  }, [requests]);

  // Configure Dynamic Columns for the Table
  const tableColumns: ColumnConfig<ServiceRequest>[] = useMemo(
    () => [
      {
        key: "student",
        label: "Student Name",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
              {row.student?.name?.charAt(0) || "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{row.student?.name || "Unknown"}</p>
              <p className="text-xs text-gray-500">{row.student?.email || "N/A"}</p>
            </div>
          </div>
        ),
      },
      {
        key: "service",
        label: "Service Name",
        render: (row) => <span className="text-sm text-gray-700">{row.service?.name || "N/A"}</span>,
      },
      {
        key: "category",
        label: "Category",
        render: (row) => (
          <span className="text-sm font-medium text-gray-700">
            {row.category || row.service?.category || "N/A"}
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
            Cancelled: "bg-gray-100 text-gray-700 border-gray-200",
          };
          return (
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[row.status] || styles.Pending}`}
            >
              {row.status}
            </span>
          );
        },
      },
      {
        key: "documents",
        label: "Documents Count",
        render: (row) => (
          <span className="text-sm text-gray-600">{row.requiredDocuments?.length || 0}</span>
        ),
      },
      {
        key: "createdAt",
        label: "Created At",
        render: (row) => (
          <span className="text-sm text-gray-600">
            {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }) : "N/A"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(`/dashboard/requests/${row._id}`)}
              title="View Details"
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            {row.status !== "Approved" && row.status !== "Cancelled" && (
              <button 
                onClick={() => handleOpenReview(row)}
                className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-xs font-semibold transition-colors"
              >
                Review
              </button>
            )}
            
          </div>
        ),
      },
    ],
    []
  );



  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FB] w-full">
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
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
            <p className="text-sm font-medium text-gray-500 mb-1">
              Pending Requests
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.pending}
            </h3>
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
            <p className="text-sm font-medium text-gray-500 mb-1">
              Approved Today
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.approvedToday}
            </h3>
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
            <p className="text-sm font-medium text-gray-500 mb-1">
              Rejected Today
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.rejectedToday}
            </h3>
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
            <p className="text-sm font-medium text-gray-500 mb-1">
              Avg Processing Time
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.avgProcessingTime}
            </h3>
          </div>
        </div>

        {/* Dynamic Reusable Table Section */}
        {loading.fetchAll ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-red-100">
            <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
            <p className="text-red-600 font-semibold mb-2">Error loading requests</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <button 
              onClick={() => dispatch(getAllRequests({ page: 1, limit: 10 }))}
              className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Requests Found</h3>
            <p className="text-gray-500 text-sm">There are no student requests waiting in the queue.</p>
          </div>
        ) : (
          <ReusableTable
            title="Processing Queue"
            subtitle="Latest international student applications requiring review"
            columns={tableColumns}
            data={filteredRequests}
            isLoading={loading.fetchAll}
            actions={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-10 pr-8 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button 
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            }
          />
        )}

        {/* Review Modal */}
        {isReviewModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Review Request</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Updating status for <span className="font-semibold text-blue-600">{selectedRequest.student?.name}</span>
                  </p>
                </div>
                <button 
                  onClick={handleCloseReview}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                {/* Status Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Set Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["Approved", "Rejected"] as RequestStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setReviewStatus(status)}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          reviewStatus === status
                            ? status === "Approved" ? "border-green-500 bg-green-50 text-green-700"
                            : status === "Rejected" ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                            : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {status === "Approved" && <CheckCircle2 className="w-4 h-4" />}
                        {status === "Rejected" && <XCircle className="w-4 h-4" />}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Review Notes</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add feedback or reasons for the status update..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none text-gray-700 placeholder:text-gray-400"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCloseReview}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading.review}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                  >
                    {loading.review ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
