import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2Icon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  Loader2,
  PencilIcon,
  User2Icon,
} from "lucide-react";
import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { useAppSelector } from "@/store/hooks/hook";

const SectionCard = ({ title, icon, onEdit, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-2.5 font-semibold text-gray-800 text-[15px]">
        <span className="text-indigo-600">{icon}</span>
        {title}
      </div>
      <button
        onClick={onEdit}
        className="flex items-center gap-1.5 text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
      >
        <PencilIcon className="size-4" />
        Edit
      </button>
    </div>
    <div className="px-5 sm:px-6 py-5">{children}</div>
  </div>
);

const InfoField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-400 font-medium">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value}</span>
  </div>
);

const DocumentItem = ({ name, size, type }) => (
  <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3 py-3">
    {type === "pdf" ? (
      <FaFilePdf className="text-red-600" />
    ) : (
      <ImageIcon className="text-blue-500" />
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
      <p className="text-xs text-gray-400 mt-0.5">{size}</p>
    </div>
    <CheckCircle2Icon className="size-5 text-emerald-500" />
  </div>
);

export function STEP_4({ 
  files = [], 
  onBack, 
  onNext, 
  isSubmitting = false,
  serviceName = "Service Request"
}: { 
  files?: File[], 
  onBack: () => void, 
  onNext: () => void,
  isSubmitting?: boolean,
  serviceName?: string
}) {
  const [agreed, setAgreed] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-300/10 py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="mb-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Review {serviceName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please review your information before submitting.
          </p>
        </div>

        {/* Personal Information */}
        <SectionCard
          title="Personal Information"
          icon={<User2Icon className="size-5" />}
          onEdit={onBack}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <InfoField label="Full Name" value={user?.name || "N/A"} />
            <InfoField label="Student ID" value={user?.studentId || "N/A"} />
            <InfoField label="Nationality" value={user?.nationality || "N/A"} />
            <InfoField label="Passport Number" value={user?.passportNumber || "N/A"} />
            <InfoField label="Phone" value={user?.phone || "N/A"} />
            <InfoField label="Email" value={user?.email || "N/A"} />
          </div>
        </SectionCard>

        {/* Uploaded Documents */}
        <SectionCard
          title="Uploaded Documents"
          icon={<FolderIcon className="size-5 " />}
          onEdit={onBack}
        >
          {files.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {files.map((file, idx) => (
                <DocumentItem
                  key={idx}
                  name={file.name}
                  size={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                  type={file.name.endsWith(".pdf") ? "pdf" : "image"}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic text-center py-4">No documents uploaded</p>
          )}
        </SectionCard>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 sm:px-6 py-5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
                  agreed
                    ? "bg-indigo-600 border-indigo-600"
                    : "bg-white border-gray-300 group-hover:border-indigo-400"
                }`}
              >
                <Check className="text-white" />
              </div>
            </div>
            <span className="text-sm text-gray-500 leading-relaxed select-none">
              I hereby declare that the attached documents are authentic and the
              information provided above is accurate. I understand that any
              false information may lead to the rejection of my request.
            </span>
          </label>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-1 pb-4">
          <button 
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="size-4 inline-block mr-2" /> Back
          </button>
          <button
            onClick={onNext}
            disabled={!agreed || isSubmitting}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
              agreed && !isSubmitting
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95"
                : "bg-indigo-200 text-indigo-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
