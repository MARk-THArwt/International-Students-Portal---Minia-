/** Generic paginated / enveloped list response from the backend. */
export interface ApiListResponse<T> {
  status: string;
  data: T[];
  results: number;
  totalPages: number;
  page: number;
}

/** Generic single-resource response from the backend. */
export interface ApiItemResponse<T> {
  status: string;
  data: T;
  message?: string;
}

/** Payload accepted by updateService. */
export interface UpdateServicePayload {
  id: string;
  data: FormData | Partial<Omit<Service, "_id" | "createdAt" | "updatedAt">>;
}

export type LoadingStatus = "idle" | "loading" | "succeeded" | "failed";

export interface Service {
  _id: string;
  name: string;
  description: string;
  category: "education" | "visa" | "housing" | "financial";
  price: number;
  priority: "low" | "medium" | "high";
  image?: string | null;
  requiredDocuments: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicesState {
  services: Service[];
  loading: boolean;
  status: LoadingStatus;
  error: string | null;
}

