// ─── Domain Types ─────────────────────────────────────────────────────────────

export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName?: string;
  status: RequestStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
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

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
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

  // Pagination
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
