import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Loader2,
  FileIcon,
  Eye,
  X,
  Download,
  MessageSquare,
  Send
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import { getRequestDetails, reviewRequest } from "../../store/AsyncThunks/requestsThunks";
import type { RequestStatus } from "../../store/types/requestsTypes";
import { toast } from "sonner";

export default function RequestDetailsPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { requestDetails: request, loading, error } = useAppSelector((state) => state.requests);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Review Form State
  const [reviewStatus, setReviewStatus] = useState<RequestStatus>("Pending");
  const [reviewNotes, setReviewNotes] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    if (requestId) {
      dispatch(getRequestDetails(requestId));
    }
  }, [dispatch, requestId]);

  // Sync internal review state when request data loads
  useEffect(() => {
    if (request) {
      setReviewStatus(request.status);
      setReviewNotes(request.reviewNotes || "");
    }
  }, [request]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !requestId) return;

    try {
      await dispatch(reviewRequest({
        requestId,
        status: reviewStatus,
        reviewNotes: reviewNotes
      })).unwrap();
      
      toast.success(`Request marked as ${reviewStatus} successfully`);
      setIsReviewing(false);
    } catch (err) {
      toast.error("Failed to update request status");
      console.error("Review Error:", err);
    }
  };

  if (loading.fetchDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-original-primary animate-spin mb-4" />
        <p className="text-original-text-muted font-medium">Fetching request details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="w-16 h-16 bg-original-danger-light rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-original-danger" />
        </div>
        <h2 className="text-xl font-bold text-original-text-dark mb-2">Request Not Found</h2>
        <p className="text-original-text-muted text-center max-w-md mb-6">
          {error || "We couldn't find the request you're looking for or it may have been deleted."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-2 bg-original-primary text-white text-white rounded-xl font-bold hover:bg-original-primary-hover transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved": return "bg-original-success-light text-original-success border-original-success-light";
      case "Rejected": return "bg-original-danger-light text-original-danger border-original-danger-light";
      case "Cancelled": return "bg-original-background-alt text-original-text border-original-border";
      default: return "bg-original-warning-light text-original-warning border-original-warning-light";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved": return <CheckCircle2 className="w-5 h-5" />;
      case "Rejected": return <XCircle className="w-5 h-5" />;
      case "Cancelled": return <Clock className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-original-background w-full">
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-original-card rounded-xl shadow-sm border border-original-border-light text-original-text-muted hover:text-original-primary hover:bg-original-background-alt text-original-primary transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-original-text-dark">Request Details</h2>
              <p className="text-sm text-original-text-muted">ID: #{request._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          
          {/* Top Actions */}
          {request.status !== "Approved" && request.status !== "Cancelled" && !isReviewing && (
            <button 
              onClick={() => setIsReviewing(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-original-primary text-white text-white rounded-xl font-bold hover:bg-original-primary-hover transition-all shadow-lg dark:shadow-black/20"
            >
              <MessageSquare className="w-4 h-4" />
              Process Request
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Student & Service Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Review Section (Conditional) */}
            {isReviewing && (
              <div className="bg-original-card rounded-2xl shadow-xl border-2 border-original-border-light overflow-hidden animate-in slide-in-from-top-4 duration-300">
                <div className="p-6 border-b border-original-border-light bg-original-background-alt text-original-primary/30 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-original-secondary flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Reviewing Application
                  </h3>
                  <button onClick={() => setIsReviewing(false)} className="text-original-text-muted/70 hover:text-original-text-muted p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setReviewStatus("Approved")}
                      className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 font-bold transition-all ${
                        reviewStatus === "Approved" 
                        ? "border-original-success bg-original-success-light text-original-success" 
                        : "border-original-border-light bg-original-background-alt text-original-text-muted hover:border-original-border"
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Approve Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewStatus("Rejected")}
                      className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 font-bold transition-all ${
                        reviewStatus === "Rejected" 
                        ? "border-original-danger bg-original-danger-light text-original-danger" 
                        : "border-original-border-light bg-original-background-alt text-original-text-muted hover:border-original-border"
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Request
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-original-text mb-2">Review Notes / Feedback</label>
                    <textarea 
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="w-full p-4 rounded-xl border border-original-border bg-original-background-alt focus:bg-original-card focus:ring-4 focus:ring-original-primary-light focus:border-original-primary outline-none transition-all resize-none h-32"
                      placeholder="Explain the reason for approval or rejection..."
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsReviewing(false)}
                      className="px-6 py-2.5 text-original-text-muted font-bold hover:bg-original-background-alt rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading.review}
                      className="flex items-center gap-2 px-8 py-2.5 bg-original-primary text-white text-white rounded-xl font-bold hover:bg-original-primary-hover transition-all shadow-lg dark:shadow-black/20 disabled:opacity-50"
                    >
                      {loading.review ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit Decision
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Main Info Card */}
            <div className="bg-original-card rounded-2xl shadow-sm border border-original-border-light overflow-hidden">
              <div className="p-6 border-b border-original-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-original-background-alt text-original-primary text-original-primary flex items-center justify-center font-bold text-2xl">
                    {request.student?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-original-text-dark">{request.student?.name}</h3>
                    <p className="text-original-text-muted flex items-center gap-1.5 mt-1">
                      <Mail className="w-4 h-4" />
                      {request.student?.email}
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold text-sm ${getStatusStyle(request.status)}`}>
                  {getStatusIcon(request.status)}
                  {request.status}
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-original-background-alt text-original-primary rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-original-text-muted/70 uppercase tracking-wider">Service Name</p>
                      <p className="text-original-text-dark font-semibold mt-0.5">{request.service?.name || "Service unavailable"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-original-background-alt text-original-primary rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-original-text-muted/70 uppercase tracking-wider">Category</p>
                      <p className="text-original-text-dark font-semibold mt-0.5">{request.category || request.service?.category || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-original-background-alt text-original-primary text-original-primary rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-original-text-muted/70 uppercase tracking-wider">Assigned To</p>
                      <p className="text-original-text-dark font-semibold mt-0.5">{request.assignedTo?.name || "Not assigned yet"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-original-warning-light text-original-warning rounded-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-original-text-muted/70 uppercase tracking-wider">Requested On</p>
                      <p className="text-original-text-dark font-semibold mt-0.5">
                        {new Date(request.createdAt).toLocaleDateString("en-US", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-original-card rounded-2xl shadow-sm border border-original-border-light p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-original-text-dark flex items-center gap-2">
                  <FileIcon className="w-5 h-5 text-original-primary" />
                  Attached Documents
                </h3>
                <span className="px-2.5 py-1 bg-original-background-alt text-original-text-muted text-xs font-bold rounded-lg">
                  {(request.requiredDocuments?.length || 0) + (request.documents?.length || 0)} total
                </span>
              </div>

              {/* General Documents */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-original-text mb-3">General Documents</h4>
                {(!request.documents || request.documents.length === 0) ? (
                  <p className="text-sm text-original-text-muted italic">No documents uploaded</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {request.documents.map((docUrl, idx) => (
                      <a 
                        key={idx} 
                        href={docUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-original-primary hover:underline text-sm flex items-center gap-2"
                      >
                        <FileIcon className="w-4 h-4" /> Document {idx + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Required Documents */}
              <div>
                <h4 className="text-sm font-bold text-original-text mb-3">Required Documents</h4>
                {(!request.requiredDocuments || request.requiredDocuments.length === 0) ? (
                  <p className="text-sm text-original-text-muted italic">No required documents</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {request.requiredDocuments.map((doc, idx) => (
                      <div key={idx} className="group p-4 rounded-2xl border border-original-border-light bg-original-background-alt/50 hover:bg-original-card hover:border-original-border-light hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-original-card rounded-lg border border-original-border-light text-original-primary">
                            <FileIcon className="w-6 h-6" />
                          </div>
                          <div className="flex gap-2">
                            {doc.file?.path ? (
                              <>
                                <a 
                                  href={doc.file.path} 
                                  download
                                  className="p-1.5 text-original-text-muted/70 hover:text-original-success hover:bg-original-success-light rounded-lg transition-colors"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                                <button 
                                  onClick={() => setSelectedImage(doc.file?.path || null)}
                                  className="p-1.5 text-original-text-muted/70 hover:text-original-primary hover:bg-original-background-alt text-original-primary rounded-lg transition-colors"
                                  title="Quick View"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] font-bold text-original-warning bg-original-warning-light px-2 py-0.5 rounded-full uppercase tracking-tight">
                                Missing
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-original-text-dark truncate" title={doc.name}>
                            {doc.name}
                          </h4>
                          <p className="text-xs text-original-text-muted mt-1">
                            {doc.file?.originalName || "Not uploaded yet"}
                          </p>
                        </div>
                        
                        {doc.file?.path && (
                          <div className="mt-4 relative aspect-[4/3] rounded-xl overflow-hidden border border-original-border bg-original-card group-hover:border-original-border-light transition-colors">
                            <img 
                              src={doc.file.path} 
                              alt={doc.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Image+Not+Found";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => setSelectedImage(doc.file?.path || null)}
                                className="bg-original-card text-original-text-dark px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl hover:bg-original-background-alt"
                              >
                                <Eye className="w-4 h-4" />
                                View Full
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Review Notes & Metadata */}
          <div className="space-y-6">
            <div className="bg-original-card rounded-2xl shadow-sm border border-original-border-light p-6">
              <h3 className="text-lg font-bold text-original-text-dark mb-4">Review History / Notes</h3>
              <div className="p-4 rounded-xl bg-original-background-alt border border-original-border-light">
                {request.reviewNotes ? (
                  <p className="text-sm text-original-text leading-relaxed italic">
                    "{request.reviewNotes}"
                  </p>
                ) : (
                  <p className="text-sm text-original-text-muted/70 italic">
                    No notes provided for this request.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-original-card rounded-2xl shadow-sm border border-original-border-light p-6 space-y-4">
              <h3 className="text-lg font-bold text-original-text-dark">Internal Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-original-border-light">
                  <span className="text-sm text-original-text-muted">Database ID</span>
                  <span className="text-xs font-mono text-original-text-muted/70">{request._id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-original-border-light">
                  <span className="text-sm text-original-text-muted">Last Updated</span>
                  <span className="text-sm font-medium text-original-text">
                    {new Date(request.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-original-text-muted">Version</span>
                  <span className="text-sm font-medium text-original-text">v{request.__v}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 bg-original-card/10 hover:bg-original-card/20 text-white rounded-full transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center p-4">
            <img 
              src={selectedImage} 
              alt="Full Preview" 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
