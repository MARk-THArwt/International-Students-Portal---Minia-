import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { extractErrorMessage } from "../../api/api";
import type {
  ServiceRequest,
  GetMyRequestsParams,
  CreateRequestPayload,
  CancelRequestPayload,
  ReviewRequestPayload,
  UploadFilesPayload,
  PaginatedRequestsResponse,
  GetAllRequestsParams,
} from "../types/requestsTypes";

// ─── 1. Get My Requests ───────────────────────────────────────────────────────
export const getMyRequests = createAsyncThunk<
  PaginatedRequestsResponse,
  GetMyRequestsParams,
  { rejectValue: string }
>(
  "requests/getMyRequests",
  async ({ page = 1, limit = 8 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get<PaginatedRequestsResponse>("/requests/my", {
        params: { page, limit },
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

// ─── 2. Cancel Request ────────────────────────────────────────────────────────
export const cancelRequest = createAsyncThunk<
  ServiceRequest,
  CancelRequestPayload,
  { rejectValue: string }
>("requests/cancelRequest", async ({ requestId }, { rejectWithValue }) => {
  try {
    const { data } = await api.put<ServiceRequest>(
      `/requests/${requestId}/cancel`,
    );
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// ─── 3. Review Request (Admin / Staff only) ───────────────────────────────────
export const reviewRequest = createAsyncThunk<
  ServiceRequest,
  ReviewRequestPayload,
  { rejectValue: string }
>(
  "requests/reviewRequest",
  async ({ requestId, status, reviewNotes }, { rejectWithValue }) => {
    try {
      const { data } = await api.put<ServiceRequest>(
        `/requests/${requestId}/review`,
        { status, reviewNotes },
      );
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

// ─── 4. Create Request ────────────────────────────────────────────────────────
export const createRequest = createAsyncThunk<
  ServiceRequest,
  CreateRequestPayload,
  { rejectValue: string }
>("requests/createRequest", async ({ serviceId, documents }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("serviceId", serviceId);
    
    if (documents && documents.length > 0) {
      documents.forEach((file) => {
        formData.append("documents", file);
      });
    }

    const { data } = await api.post<ServiceRequest>(
      "/requests/",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  } catch (error) {
    console.error("Create Request Error:", error);
    return rejectWithValue(extractErrorMessage(error));
  }
});

// ─── 5. Upload Files ──────────────────────────────────────────────────────────
export const uploadFiles = createAsyncThunk<
  ServiceRequest,
  UploadFilesPayload,
  { rejectValue: string }
>("requests/uploadFiles", async ({ requestId, file }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("document", file);

    const { data } = await api.post<ServiceRequest>(
      `/requests/${requestId}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// ─── 6. Get All Requests (Admin / Staff only) ────────────────────────────────
export const getAllRequests = createAsyncThunk<
  PaginatedRequestsResponse,
  GetAllRequestsParams,
  { rejectValue: string }
>(
  "requests/getAllRequests",
  async ({ page = 1, limit = 8 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get<PaginatedRequestsResponse>("/requests/all", {
        params: { page, limit },
      });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

// ─── 7. Get Request Details ──────────────────────────────────────────────────
export const getRequestDetails = createAsyncThunk<
  ServiceRequest,
  string,
  { rejectValue: string }
>("requests/getRequestDetails", async (requestId, { rejectWithValue }) => {
  try {
    const { data } = await api.get<{ status: string; data: ServiceRequest }>(
      `/requests/${requestId}`,
    );
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
