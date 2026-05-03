// ─── Domain Types ─────────────────────────────────────────────────────────────

export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface RequestService {
  _id: string;
  name: string;
}

export interface ServiceRequest {
  _id: string;
  student: string;
  service: RequestService;
  status: RequestStatus;
  documents: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ─── API Payload Types ────────────────────────────────────────────────────────

export interface CreateRequestPayload {
  serviceId: string;
}

export interface ReviewRequestPayload {
  requestId: string;
  status: "Approved" | "Rejected" | "Pending";
  notes: string;
}

export interface CancelRequestPayload {
  requestId: string;
}

export interface UploadFilesPayload {
  requestId: string;
  file: File;
}

export interface GetMyRequestsParams {
  page?: number;
  limit?: number;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface PaginatedRequestsResponse {
  status: string;
  page: number;
  results: number;
  totalPages: number;
  data: ServiceRequest[];
}

// ─── Slice State ──────────────────────────────────────────────────────────────

export interface RequestsState {
  requests: ServiceRequest[];

  // Granular per-operation loading flags
  loading: {
    fetch: boolean;
    create: boolean;
    cancel: boolean;
    review: boolean;
    upload: boolean;
  };

  error: string | null;

  // Pagination (kept for future use / page UI controls)
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
