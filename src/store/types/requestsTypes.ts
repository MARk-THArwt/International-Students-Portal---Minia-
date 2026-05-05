// ─── Domain Types ─────────────────────────────────────────────────────────────

export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface RequestService {
  _id: string;
  name: string;
  category?: string;
}

export interface StudentDetails {
  _id: string;
  name: string;
  email: string;
}

export interface RequestDocument {
  name: string;
  file?: {
    path: string;
    originalName?: string;
  };
}

export interface ServiceRequest {
  _id: string;
  student: StudentDetails;
  service: RequestService | null;
  category?: string;
  status: RequestStatus;
  documents: string[];
  requiredDocuments: RequestDocument[];
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ─── API Payload Types ────────────────────────────────────────────────────────

export interface CreateRequestPayload {
  serviceId: string;
  documents: File[];
}

export interface ReviewRequestPayload {
  requestId: string;
  status: "Approved" | "Rejected" | "Pending" | "Cancelled";
  reviewNotes: string;
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

export interface GetAllRequestsParams {
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
  requestDetails: ServiceRequest | null;

  // Granular per-operation loading flags
  loading: {
    fetch: boolean;
    create: boolean;
    cancel: boolean;
    review: boolean;
    upload: boolean;
    fetchAll: boolean;
    fetchDetails: boolean;
  };

  error: string | null;

  // Pagination (kept for future use / page UI controls)
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
