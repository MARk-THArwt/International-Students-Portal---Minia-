/** Generic paginated / enveloped list response from the backend. */
export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Generic single-resource response from the backend. */
export interface ApiItemResponse<T> {
  data: T;
  message?: string;
}
/** Payload accepted by updateService. */
export interface UpdateServicePayload {
  id: string;
  data: Partial<Omit<Service, "_id" | "createdAt" | "updatedAt">>;
}
export type LoadingStatus = "idle" | "loading" | "succeeded" | "failed";
export interface Service {
  _id: string;
  name: string;
  description: string;
  category?: string;
  price?: number;
  image?: string | null;
  requiredDocuments?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface ServicesState {
  items: Service[];
  total: number;
  /** Granular per-operation status; add more keys as the API surface grows. */
  status: {
    fetch: LoadingStatus;
    update: LoadingStatus;
    delete: LoadingStatus;
  };
  /** Granular per-operation error messages. */
  error: {
    fetch: string | null;
    update: string | null;
    delete: string | null;
  };
  /** Track which service is currently being mutated (useful for optimistic UI). */
  activeServiceId: string | null;
}
