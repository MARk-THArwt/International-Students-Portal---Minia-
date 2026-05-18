import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";

type DropZoneProps = {
  onFilesAdded: (files: File[]) => void;
};

const MAX_FILE_SIZE_MB = 6;
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
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer py-12 px-6 transition",
        isDragAccept
          ? "border-original-success bg-original-success-light"
          : isDragReject
            ? "border-original-danger bg-original-danger-light"
            : isDragActive
              ? "border-original-primary-light bg-original-background-alt"
              : "border-original-border-light hover:border-original-primary-light hover:bg-original-background-alt/40",
      )}
    >
      <input {...getInputProps()} />

      <UploadCloud
        className={cn(
          "h-10 w-10",
          isDragAccept
            ? "text-original-success"
            : isDragReject
              ? "text-original-danger"
              : isDragActive
                ? "text-original-primary"
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
              <span className="text-original-primary font-semibold">
                Click to upload
              </span>{" "}
              or drag and drop
            </>
          )}
        </p>
        <p className="text-xs text-original-text-muted/70 mt-1">
          Any file type accepted (max {MAX_FILE_SIZE_MB}MB)
        </p>
      </div>
    </div>
  );
}
