import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
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
  ExternalLink,
  X,
  Download,
  MessageSquare,
  Send
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import { getRequestDetails, reviewRequest } from "../../store/AsyncThunks/requestsThunks";
import { Topbar } from "../../component/DashbordComp/Topbar";
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
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Fetching request details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Request Not Found</h2>
        <p className="text-gray-500 text-center max-w-md mb-6">
          {error || "We couldn't find the request you're looking for or it may have been deleted."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700 border-green-200";
      case "Rejected": return "bg-red-100 text-red-700 border-red-200";
      case "Cancelled": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-yellow-100 text-yellow-700 border-yellow-200";
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
    <div className="flex flex-col min-h-screen bg-[#F4F7FB] w-full">
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
              <p className="text-sm text-gray-500">ID: #{request._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          
          {/* Top Actions */}
          {request.status !== "Approved" && request.status !== "Cancelled" && !isReviewing && (
            <button 
              onClick={() => setIsReviewing(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
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
              <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                <div className="p-6 border-b border-gray-50 bg-blue-50/30 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Reviewing Application
                  </h3>
                  <button onClick={() => setIsReviewing(false)} className="text-gray-400 hover:text-gray-600 p-1">
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
                        ? "border-green-500 bg-green-50 text-green-700" 
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
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
                        ? "border-red-500 bg-red-50 text-red-700" 
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Request
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Review Notes / Feedback</label>
                    <textarea 
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none h-32"
                      placeholder="Explain the reason for approval or rejection..."
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsReviewing(false)}
                      className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading.review}
                      className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                      {loading.review ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit Decision
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Main Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl">
                    {request.student?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{request.student?.name}</h3>
                    <p className="text-gray-500 flex items-center gap-1.5 mt-1">
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
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service Name</p>
                      <p className="text-gray-900 font-semibold mt-0.5">{request.service?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</p>
                      <p className="text-gray-900 font-semibold mt-0.5">{request.category || request.service?.category || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Requested On</p>
                      <p className="text-gray-900 font-semibold mt-0.5">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileIcon className="w-5 h-5 text-blue-600" />
                  Attached Documents
                </h3>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg">
                  {request.requiredDocuments.length} total
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {request.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="group p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-white rounded-lg border border-gray-100 text-blue-600">
                        <FileIcon className="w-6 h-6" />
                      </div>
                      <div className="flex gap-2">
                        {doc.file?.path ? (
                          <>
                            <a 
                              href={doc.file.path} 
                              download
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            <button 
                              onClick={() => setSelectedImage(doc.file?.path || null)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Quick View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-tight">
                            Missing
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 truncate" title={doc.name}>
                        {doc.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {doc.file?.originalName || "Not uploaded yet"}
                      </p>
                    </div>
                    
                    {doc.file?.path && (
                      <div className="mt-4 relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-white group-hover:border-blue-200 transition-colors">
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
                            className="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl hover:bg-gray-50"
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
            </div>
          </div>

          {/* Right Column: Review Notes & Metadata */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Review History / Notes</h3>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                {request.reviewNotes ? (
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    "{request.reviewNotes}"
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No notes provided for this request.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Internal Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Database ID</span>
                  <span className="text-xs font-mono text-gray-400">{request._id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(request.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">Version</span>
                  <span className="text-sm font-medium text-gray-700">v{request.__v}</span>
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
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
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
