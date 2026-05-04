import { CheckCircle2, Copy, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function STEP_4({
  requestId,
  serviceName = "Service Request",
}: {
  requestId: string | null;
  serviceName?: string;
}) {
  const navigate = useNavigate();

  const copyToClipboard = () => {
    if (requestId) {
      navigator.clipboard.writeText(requestId);
      toast.success("Request ID copied to clipboard!");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 px-4">
      <div className="bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden text-center p-6">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25" />
            <div className="relative bg-emerald-500 text-white p-3 rounded-full shadow-md shadow-emerald-200">
              <CheckCircle2 className="size-8" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
          Request Submitted!
        </h1>
        <p className="text-gray-500 text-sm mb-5 max-w-xs mx-auto leading-relaxed">
          Your application for{" "}
          <span className="font-semibold text-gray-800">{serviceName}</span> has
          been received and is being processed.
        </p>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-2 mb-5">
          <button
            onClick={() => navigate("/requests")}
            className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            <FileText className="size-4" />
            Track My Requests
            <ArrowRight className="size-3.5 ml-1" />
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-500 hover:text-indigo-600 font-medium text-sm transition-colors py-1.5"
          >
            Return to Dashboard
          </button>
        </div>

        {/* Info */}
        <div className="border-t border-gray-50 pt-4">
          <p className="text-xs text-gray-400 leading-relaxed italic">
            You will receive a notification once your request status changes.
            Typical processing time is 3-5 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
