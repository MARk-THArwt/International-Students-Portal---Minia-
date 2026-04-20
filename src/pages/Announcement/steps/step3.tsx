import { DropZone } from "@/components/Dropzone";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  ImageIcon,
  InfoIcon,
  Trash2Icon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";

type FileStatus = "complete" | "uploading" | "error";
type FileType = "pdf" | "img" | "doc";

type UploadFile = {
  id: number;
  name: string;
  size: string;
  status: FileStatus;
  type: FileType;
  progress?: number;
};

type RequiredDoc = {
  id: string;
  label: string;
  sub: string;
  done: boolean;
};

const REQUIRED_DOCS: RequiredDoc[] = [
  {
    id: "passport",
    label: "Valid Passport Copy",
    sub: "Scan of the data page",
    done: true,
  },
  {
    id: "transcript",
    label: "High School Transcript",
    sub: "Original or certified copy",
    done: false,
  },
  {
    id: "language",
    label: "Language Proficiency",
    sub: "TOEFL or IELTS certificate",
    done: false,
  },
  {
    id: "photo",
    label: "Personal Photo",
    sub: "White background, passport size",
    done: false,
  },
];

const INITIAL_FILES: UploadFile[] = [
  {
    id: 1,
    name: "Passport_Copy_Front.pdf",
    size: "2.4 MB",
    status: "complete",
    type: "pdf",
  },
  {
    id: 2,
    name: "High_School_Transcript.jpg",
    size: "4.1 MB",
    status: "uploading",
    progress: 62,
    type: "img",
  },
  {
    id: 3,
    name: "Personal_Statement.docx",
    size: "",
    status: "error",
    type: "doc",
  },
];

function FileRow({
  file,
  onRemove,
}: {
  file: UploadFile;
  onRemove: (id: number) => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors
        ${
          file.status === "error"
            ? "border-red-200 bg-red-50"
            : "border-gray-100 bg-white"
        }`}
    >
      {file.status === "error" ? (
        <TriangleAlertIcon className="text-red-600" />
      ) : file.type === "pdf" ? (
        <FaFilePdf className="text-2xl text-red-800" />
      ) : (
        <ImageIcon />
      )}

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm w-80 font-medium truncate ${
            file.status === "error" ? "text-gray-700" : "text-gray-800"
          }`}
        >
          {file.name}
        </p>

        {file.status === "complete" && (
          <p className="text-xs text-gray-400 mt-0.5">{file.size} · Complete</p>
        )}

        {file.status === "uploading" && (
          <>
            <p className="text-xs text-gray-400 mt-0.5">
              {file.size} · Uploading...
            </p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <Progress
                value={file.progress ?? 0}
                className="*:bg-indigo-600 bg-gray-400"
              />
            </div>
          </>
        )}

        {file.status === "error" && (
          <p className="text-xs text-red-500 mt-0.5">
            Error: Format not supported
          </p>
        )}
      </div>

      <button
        onClick={() => onRemove(file.id)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
      >
        {file.status === "uploading" ? <XIcon /> : <Trash2Icon />}
      </button>
    </div>
  );
}

export default function STEP_3() {
  const [files, setFiles] = useState<UploadFile[]>(INITIAL_FILES);

  const removeFile = (id: number) =>
    setFiles((f) => f.filter((x) => x.id !== id));

  const addFiles = (newFiles: FileList | File[]) => {
    const mapped: UploadFile[] = Array.from(newFiles).map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(2)} MB`,
      status: "complete",
      type: f.name.endsWith(".pdf") ? "pdf" : "img",
    }));

    setFiles((prev) => [...prev, ...mapped]);
  };

  return (
    <div className="w-full max-w-4xl overflow-hidden bg-card border border-gray-100 shadow-sm rounded-2xl">
      <div className="px-8 pt-8 pb-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Upload Required Documents
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Please provide clear scans. Accepted formats: PDF, JPEG, PNG. Max 5MB
          per file.
        </p>
      </div>

      <div className="flex gap-8 px-8 pb-8">
        <div className="flex-1 min-w-0 space-y-5">
          <DropZone
            onFilesAdded={(files: FileList | File[]) => addFiles(files)}
          />

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Attached Files
              </p>
              <ScrollArea className="space-y-2 pr-5 h-50 flex flex-col max-w-full">
                {files.map((f) => (
                  <FileRow key={f.id} file={f} onRemove={removeFile} />
                ))}
              </ScrollArea>
            </div>
          )}
        </div>

        <div className="shrink-0 space-y-4 w-72">
          <div className="p-5 border border-gray-100 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 />
              <h2 className="text-sm font-bold text-gray-800">
                Required Documents
              </h2>
            </div>

            <div className="h-px mb-4 bg-gray-200" />

            <ul className="space-y-4">
              {REQUIRED_DOCS.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3">
                  <Input type="checkbox" className="size-4" />
                  <div>
                    <p
                      className={`text-sm font-medium leading-snug ${
                        doc.done
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {doc.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{doc.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 p-4 border border-indigo-100 bg-indigo-50 rounded-xl">
            <p className="text-xs leading-relaxed text-indigo-700">
              <InfoIcon className="size-4 inline-block mr-2" />
              Files must be clear and legible. Blurred documents will delay your
              application process significantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
