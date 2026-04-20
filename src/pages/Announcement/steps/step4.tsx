import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2Icon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  PencilIcon,
  User2Icon,
} from "lucide-react";
import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";

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

export default function STEP_4() {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
            <Check className="text-emerald-500 size-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Application Submitted!
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your Visa Extension Letter Request has been sent to the
            International Affairs Office.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setAgreed(false);
            }}
            className="mt-6 text-indigo-600 text-sm font-medium hover:underline"
          >
            ← Back to form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="mb-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Review Application
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please review your information before submitting.
          </p>
        </div>

        {/* Personal Information */}
        <SectionCard
          title="Personal Information"
          icon={<User2Icon className="size-5" />}
          onEdit={() => {}}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <InfoField label="Full Name" value="Ahmed Al-Masri" />
            <InfoField label="Student ID" value="20230015" />
            <InfoField label="Nationality" value="Jordanian" />
            <InfoField label="Passport Number" value="J12345678" />
            <InfoField label="Faculty" value="Faculty of Medicine" />
            <InfoField label="Academic Year" value="3rd Year" />
          </div>
        </SectionCard>

        <SectionCard
          title="Service Details"
          icon={<FileTextIcon className="size-5" />}
          onEdit={() => {}}
        >
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <InfoField
                label="Request Type"
                value="Visa Extension Letter Request"
              />
              <div className="flex flex-col gap-2">
                <InfoField
                  label="Target Department"
                  value="International Affairs Office"
                />
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium block mb-1.5">
                Priority Level
              </span>
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                Normal
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium block mb-1.5">
                Notes / Description
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">
                I need an official letter addressed to the Passport Office to
                extend my student visa for the upcoming academic semester.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Uploaded Documents"
          icon={<FolderIcon className="size-5 " />}
          onEdit={() => {}}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DocumentItem
              name="passport_scan_2023.pdf"
              size="1.2 MB"
              type="pdf"
            />
            <DocumentItem
              name="personal_photo.jpg"
              size="500 KB"
              type="image"
            />
            <DocumentItem name="current_visa.pdf" size="840 KB" type="pdf" />
          </div>
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
          <button className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
            <ArrowLeft className="size-4 inline-block" /> Back
          </button>
          <button
            onClick={() => agreed && setSubmitted(true)}
            disabled={!agreed}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
              agreed
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95"
                : "bg-indigo-200 text-indigo-400 cursor-not-allowed"
            }`}
          >
            Submit Application
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
