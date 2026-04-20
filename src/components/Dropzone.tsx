import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";

type DropZoneProps = {
  onFilesAdded: (files: File[]) => void;
};
const ACCEPTED_MIME_TYPES = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/svg+xml": [".svg"],
};

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function DropZone({ onFilesAdded }: DropZoneProps) {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length) onFilesAdded(acceptedFiles);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: ACCEPTED_MIME_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer py-12 px-6 transition",
        isDragAccept
          ? "border-green-400 bg-green-50"
          : isDragReject
            ? "border-red-400 bg-red-50"
            : isDragActive
              ? "border-indigo-400 bg-indigo-50"
              : "border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/40",
      )}
    >
      <input {...getInputProps()} />

      <UploadCloud
        className={cn(
          "h-10 w-10",
          isDragAccept
            ? "text-green-500"
            : isDragReject
              ? "text-red-500"
              : isDragActive
                ? "text-indigo-500"
                : "text-indigo-300",
        )}
      />

      <div className="text-center">
        <p className="text-sm font-medium">
          {isDragAccept ? (
            "Drop files here ✅"
          ) : isDragReject ? (
            "File type not supported ❌"
          ) : (
            <>
              <span className="text-indigo-600 font-semibold">
                Click to upload
              </span>{" "}
              or drag and drop
            </>
          )}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PNG, JPG, PDF (max {MAX_FILE_SIZE_MB}MB)
        </p>
      </div>
    </div>
  );
}
