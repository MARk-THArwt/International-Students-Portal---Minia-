import { CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function STEP_4({
  serviceName = "Service Request",
}: {
  serviceName?: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
          {t("newRequest.steps.step4.header")}
        </h1>
        <p className="text-gray-500 text-sm mb-5 max-w-xs mx-auto leading-relaxed">
          {t("newRequest.steps.step4.desc", { serviceName: serviceName })}
        </p>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-2 mb-5">
          <button
            onClick={() => navigate("/requests")}
            className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            <FileText className="size-4" />
            {t("newRequest.steps.step4.trackRequests")}
            <ArrowRight className="size-3.5 ms-1 rtl:rotate-180" />
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-500 hover:text-indigo-600 font-medium text-sm transition-colors py-1.5"
          >
            {t("newRequest.steps.step4.returnDashboard")}
          </button>
        </div>

        {/* Info */}
        <div className="border-t border-gray-50 pt-4">
          <p className="text-xs text-gray-400 leading-relaxed italic">
            {t("newRequest.steps.step4.processingNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
