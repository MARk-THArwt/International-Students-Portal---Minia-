import { DropZone } from "@/components/Dropzone";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hook";
import { selectServiceById } from "@/store/slices/servicesslice";
import { getServiceById } from "@/store/AsyncThunks/servicesThunks";
import { CheckCircle2, Info, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type FileStatus = "complete" | "uploading" | "error";
type FileType = "pdf" | "img" | "doc";

type UploadFile = {
  id: number;
  name: string;
  size: string;
  status: FileStatus;
  type: FileType;
  progress?: number;
  rawFile?: File;
};

function getFileType(name: string): FileType {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "img";
  return "doc";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function FileTypeBadge({ type }: { type: FileType }) {
  const map: Record<FileType, { label: string; cls: string }> = {
    pdf: { label: "PDF", cls: "bg-red-50 text-red-600 border-red-100" },
    img: { label: "IMG", cls: "bg-blue-50 text-blue-600 border-blue-100" },
    doc: {
      label: "DOC",
      cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  };
  const { label, cls } = map[type];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-10 h-10 rounded-lg border text-[11px] font-semibold tracking-wide shrink-0",
        cls,
      )}
    >
      {label}
    </span>
  );
}

function FileRow({
  file,
  onRemove,
}: {
  file: UploadFile;
  onRemove: (id: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors",
        file.status === "error"
          ? "border-red-200 bg-red-50/60"
          : "border-gray-100 bg-white hover:border-gray-200",
      )}
    >
      <FileTypeBadge type={file.type} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate w-60 leading-snug">
          {file.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{file.size}</span>

          {file.status === "complete" && (
            <>
              <span className="text-gray-200 text-xs">·</span>
              <span className="text-xs text-emerald-600 font-medium">
                {t("newRequest.steps.step3.fileComplete")}
              </span>
            </>
          )}
          {file.status === "error" && (
            <>
              <span className="text-gray-200 text-xs">·</span>
              <span className="text-xs text-red-500 font-medium">
                {t("newRequest.steps.step3.fileError")}
              </span>
            </>
          )}
        </div>

        {file.status === "uploading" && (
          <div className="mt-1.5 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${file.progress ?? 0}%` }}
            />
          </div>
        )}
      </div>

      <button
        onClick={() => onRemove(file.id)}
        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all cursor-pointer text-gray-400 hover:text-gray-700"
        aria-label="Remove file"
      >
        {file.status === "uploading" ? (
          <X className="size-3.5" />
        ) : (
          <Trash2 className="size-3.5" />
        )}
      </button>
    </div>
  );
}

function EmptyFiles() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
      <p className="text-xs text-gray-400 font-medium">
        {t("newRequest.steps.step3.emptyFiles")}
      </p>
    </div>
  );
}

export default function STEP_3({
  onFilesChange,
  initialFiles = [],
}: {
  onFilesChange: (files: File[]) => void;
  initialFiles?: File[];
}) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const serviceId = searchParams.get("serviceId");
  const selectedService = useAppSelector(selectServiceById(serviceId || ""));

  useEffect(() => {
    if (serviceId && !selectedService) {
      dispatch(getServiceById(serviceId));
    }
  }, [serviceId, selectedService, dispatch]);

  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>(() =>
    initialFiles.map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      size: formatSize(f.size),
      status: "complete",
      type: getFileType(f.name),
      rawFile: f,
    })),
  );

  const idRef = useRef(0);

  const removeFile = (id: number) => {
    const updated = uploadFiles.filter((x) => x.id !== id);
    setUploadFiles(updated);
    onFilesChange(updated.map((f) => f.rawFile).filter(Boolean) as File[]);
  };

  const simulateUpload = (
    entry: UploadFile,
    setter: (fn: (prev: UploadFile[]) => UploadFile[]) => void,
  ) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setter((prev) =>
          prev.map((f) =>
            f.id === entry.id ? { ...f, status: "complete", progress: 100 } : f,
          ),
        );
      } else {
        setter((prev) =>
          prev.map((f) => (f.id === entry.id ? { ...f, progress } : f)),
        );
      }
    }, 120);
  };

  const addFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const MAX_SIZE = 6 * 1024 * 1024;

    const oversized: string[] = [];
    const valid: File[] = [];

    fileArray.forEach((f) => {
      if (f.size > MAX_SIZE) oversized.push(f.name);
      else valid.push(f);
    });

    if (oversized.length > 0) {
      toast.error(t("newRequest.steps.step3.maxSizeLimit", { files: oversized.join(", ") }));
    }

    if (valid.length === 0) return;

    const mapped: UploadFile[] = valid.map((f) => ({
      id: ++idRef.current,
      name: f.name,
      size: formatSize(f.size),
      status: "uploading" as FileStatus,
      type: getFileType(f.name),
      progress: 0,
      rawFile: f,
    }));

    setUploadFiles((prev) => {
      const next = [...prev, ...mapped];
      onFilesChange(next.map((f) => f.rawFile).filter(Boolean) as File[]);
      return next;
    });

    mapped.forEach((entry) => simulateUpload(entry, setUploadFiles));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 sm:px-7 sm:pt-7 sm:pb-5 border-b border-gray-100">
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">
            {t("newRequest.steps.step3.header")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("newRequest.steps.step3.headerDesc")}
          </p>
        </div>

        <div className="flex flex-col gap-6 p-5 sm:flex-row sm:gap-6 sm:p-7">
          {/* Left — drop zone + files */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {/* Drop zone */}
            <DropZone onFilesAdded={addFiles} />

            {/* Files — always visible */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  {t("newRequest.steps.step3.attachedFiles")}
                </p>
                {uploadFiles.length > 0 && (
                  <span className="text-[11px] text-gray-400">
                    {t("newRequest.steps.step3.fileCount", { count: uploadFiles.length })}
                  </span>
                )}
              </div>

              {uploadFiles.length === 0 ? (
                <EmptyFiles />
              ) : (
                <ScrollArea className="h-45 pe-1">
                  <div className="flex flex-col gap-1.5 pe-2">
                    {uploadFiles.map((f) => (
                      <FileRow key={f.id} file={f} onRemove={removeFile} />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          {/* Right — checklist + info */}
          <div className="w-full sm:w-64 shrink-0 flex flex-col gap-3">
            {/* Required docs */}
            <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="size-3.5 text-indigo-500" />
                <h2 className="text-sm font-semibold text-gray-800">
                  {t("newRequest.steps.step3.requiredDocs")}
                </h2>
              </div>

              <ul className="space-y-3">
                {selectedService?.requiredDocuments?.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="size-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <p className="text-sm font-medium text-gray-600 leading-snug">
                      {doc}
                    </p>
                  </li>
                )) || (
                  <p className="text-xs text-gray-400 italic">
                    {t("newRequest.steps.step3.noSpecificDocs")}
                  </p>
                )}
              </ul>
            </div>

            {/* Info notice */}
            <div className="flex gap-2.5 p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl">
              <Info className="size-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-600 leading-relaxed">
                {t("newRequest.steps.step3.fileQualityNote")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
