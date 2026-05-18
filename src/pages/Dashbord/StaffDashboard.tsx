import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  Filter,
  Download,
  Loader2,
  AlertCircle,
  Eye,
  X,
} from "lucide-react";
import { Topbar } from "../../component/DashbordComp/Topbar";
import {
  ReusableTable,
  type ColumnConfig,
} from "../../component/DashbordComp/table";
import { useAppSelector, useAppDispatch } from "../../store/hooks/hook";
import {
  getAllRequests,
  reviewRequest,
} from "../../store/AsyncThunks/requestsThunks";
import type {
  ServiceRequest,
  RequestStatus,
} from "../../store/types/requestsTypes";
import { exportToExcel } from "../../util/exportToExcel";

// ================== DASHBOARD COMPONENT ==================

export function StaffDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { requests, loading, error } = useAppSelector(
    (state) => state.requests,
  );

  // Review Form State
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
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
      await dispatch(
        reviewRequest({
          requestId: selectedRequest._id,
          status: reviewStatus as any,
          reviewNotes: reviewNotes,
        }),
      ).unwrap();

      handleCloseReview();
      // Optionally show success message here
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  const handleExport = () => {
    const exportData = filteredRequests.map((req) => ({
      "Student Name": req.student?.name || "N/A",
      Email: req.student?.email || "N/A",
      "Service Name": req.service?.name || "Service unavailable",
      Category: req.category || req.service?.category || "N/A",
      Status: req.status,
      "Documents Count": req.requiredDocuments?.length || 0,
      "Created At": req.createdAt
        ? new Date(req.createdAt).toLocaleDateString()
        : "N/A",
    }));

    exportToExcel(
      exportData,
      `Requests_Export_${new Date().toISOString().split("T")[0]}`,
      "Requests",
    );
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
            <div className="w-8 h-8 rounded-full bg-original-background-alt text-original-primary text-original-primary flex items-center justify-center font-bold text-xs shrink-0">
              {row.student?.name?.charAt(0) || "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-original-text-dark">
                {row.student?.name || "Unknown"}
              </p>
              <p className="text-xs text-original-text-muted">
                {row.student?.email || "N/A"}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "service",
        label: "Service Name",
        render: (row) => (
          <span className="text-sm text-original-text">
            {row.service?.name || "Service unavailable"}
          </span>
        ),
      },
      {
        key: "category",
        label: "Category",
        render: (row) => (
          <span className="text-sm font-medium text-original-text">
            {row.category || row.service?.category || "N/A"}
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (row) => {
          const styles = {
            Pending: "bg-original-warning-light text-original-warning border-original-warning-light",
            Approved: "bg-original-success-light text-original-success border-original-success-light",
            Rejected: "bg-original-danger-light text-original-danger border-original-danger-light",
            Cancelled: "bg-original-background-alt text-original-text border-original-border",
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
          <span className="text-sm text-original-text-muted">
            {row.requiredDocuments?.length > 0
              ? row.requiredDocuments.length
              : "No required documents"}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Created At",
        render: (row) => (
          <span className="text-sm text-original-text-muted">
            {row.createdAt
              ? new Date(row.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
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
              className="p-1.5 text-original-primary hover:bg-original-background-alt text-original-primary rounded-md transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            {row.status !== "Approved" && row.status !== "Cancelled" && (
              <button
                onClick={() => handleOpenReview(row)}
                className="px-3 py-1 bg-original-primary text-white text-white hover:bg-original-primary-hover rounded-md text-xs font-semibold transition-colors"
              >
                Review
              </button>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col min-h-screen bg-original-background w-full">
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
        <Topbar title="Staff Overview" showSearch={true} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1 */}
          <div className="bg-original-card p-5 rounded-xl shadow-sm border border-original-border-light flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-original-warning-light text-original-warning flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-original-danger bg-original-danger-light px-2 py-1 rounded-full flex items-center gap-1">
                ↑ 12%
              </span>
            </div>
            <p className="text-sm font-medium text-original-text-muted mb-1">
              Pending Requests
            </p>
            <h3 className="text-2xl font-bold text-original-text-dark">
              {stats.pending}
            </h3>
          </div>

          {/* Card 2 */}
          <div className="bg-original-card p-5 rounded-xl shadow-sm border border-original-border-light flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-original-success-light text-original-success flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-original-success bg-original-success-light px-2 py-1 rounded-full flex items-center gap-1">
                ↑ 8%
              </span>
            </div>
            <p className="text-sm font-medium text-original-text-muted mb-1">
              Approved Today
            </p>
            <h3 className="text-2xl font-bold text-original-text-dark">
              {stats.approvedToday}
            </h3>
          </div>

          {/* Card 3 */}
          <div className="bg-original-card p-5 rounded-xl shadow-sm border border-original-border-light flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-original-danger-light text-original-danger flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-original-text-muted bg-original-background-alt px-2 py-1 rounded-full flex items-center gap-1">
                ↓ 2%
              </span>
            </div>
            <p className="text-sm font-medium text-original-text-muted mb-1">
              Rejected Today
            </p>
            <h3 className="text-2xl font-bold text-original-text-dark">
              {stats.rejectedToday}
            </h3>
          </div>

          {/* Card 4 */}
          <div className="bg-original-card p-5 rounded-xl shadow-sm border border-original-border-light flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-original-background-alt text-original-primary text-original-primary flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-original-success bg-original-success-light px-2 py-1 rounded-full flex items-center gap-1">
                ↓ 5%
              </span>
            </div>
            <p className="text-sm font-medium text-original-text-muted mb-1">
              Avg Processing Time
            </p>
            <h3 className="text-2xl font-bold text-original-text-dark">
              {stats.avgProcessingTime}
            </h3>
          </div>
        </div>

        {/* Dynamic Reusable Table Section */}
        {loading.fetchAll ? (
          <div className="flex flex-col items-center justify-center py-20 bg-original-card rounded-xl shadow-sm border border-original-border-light">
            <Loader2 className="w-10 h-10 text-original-primary animate-spin mb-4" />
            <p className="text-original-text-muted font-medium">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-original-card rounded-xl shadow-sm border border-original-danger-light">
            <AlertCircle className="w-10 h-10 text-original-danger mb-4" />
            <p className="text-original-danger font-semibold mb-2">
              Error loading requests
            </p>
            <p className="text-original-text-muted text-sm">{error}</p>
            <button
              onClick={() => dispatch(getAllRequests({ page: 1, limit: 10 }))}
              className="mt-4 px-4 py-2 bg-original-danger-light text-original-danger rounded-lg text-sm font-semibold hover:bg-original-danger-light transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-original-card rounded-xl shadow-sm border border-original-border-light">
            <div className="w-16 h-16 bg-original-background-alt rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-original-text-muted/70" />
            </div>
            <h3 className="text-lg font-bold text-original-text-dark mb-1">
              No Requests Found
            </h3>
            <p className="text-original-text-muted text-sm">
              There are no student requests waiting in the queue.
            </p>
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
                    className="appearance-none pl-10 pr-8 py-2 text-sm font-medium text-original-text bg-original-card border border-original-border rounded-lg hover:bg-original-background-alt transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-original-primary focus:border-transparent cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <Filter className="w-4 h-4 text-original-text-muted/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-original-primary text-white border border-transparent rounded-lg hover:bg-original-primary-hover transition-colors shadow-sm"
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
            <div className="bg-original-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-original-border-light flex justify-between items-center bg-original-background-alt/50">
                <div>
                  <h3 className="text-xl font-bold text-original-text-dark">
                    Review Request
                  </h3>
                  <p className="text-sm text-original-text-muted mt-1">
                    Updating status for{" "}
                    <span className="font-semibold text-original-primary">
                      {selectedRequest.student?.name}
                    </span>
                  </p>
                </div>
                <button
                  onClick={handleCloseReview}
                  className="p-2 text-original-text-muted/70 hover:text-original-text-muted hover:bg-original-background-alt rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                {/* Status Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-original-text">
                    Set Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["Approved", "Rejected"] as RequestStatus[]).map(
                      (status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setReviewStatus(status)}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                            reviewStatus === status
                              ? status === "Approved"
                                ? "border-original-success bg-original-success-light text-original-success"
                                : status === "Rejected"
                                  ? "border-original-danger bg-original-danger-light text-original-danger"
                                  : "border-original-border-light bg-original-card text-original-text-muted hover:border-original-border hover:bg-original-background-alt"
                              : "border-original-border-light bg-original-card text-original-text-muted hover:border-original-border hover:bg-original-background-alt"
                          }`}
                        >
                          {status === "Approved" && (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          {status === "Rejected" && (
                            <XCircle className="w-4 h-4" />
                          )}
                          {status}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Notes Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-original-text">
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add feedback or reasons for the status update..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-original-border focus:ring-4 focus:ring-original-primary-light focus:border-original-primary outline-none transition-all resize-none text-original-text placeholder:text-original-text-muted/70"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-original-border-light">
                  <button
                    type="button"
                    onClick={handleCloseReview}
                    className="flex-1 px-6 py-3 border border-original-border text-original-text-muted rounded-xl font-bold hover:bg-original-background-alt transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading.review}
                    className="flex-1 px-6 py-3 bg-original-primary text-white text-white rounded-xl font-bold hover:bg-original-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg dark:shadow-black/20"
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
