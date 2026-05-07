import axios, { AxiosError } from "axios";

// ─── Axios Instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
  withCredentials: true,
});

// ─── Error Helper ─────────────────────────────────────────────────────────────
/**
 * Extracts a human-readable error message from an Axios error or unknown throw.
 * Priority: response.data.message → response.data.error → status text → fallback
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    return (
      data?.message ??
      data?.error ??
      error.response?.statusText ??
      error.message ??
      "An unexpected error occurred."
    );
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}

export default api;
