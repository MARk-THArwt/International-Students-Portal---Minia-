import { createSlice } from "@reduxjs/toolkit";
import type { RequestsState } from "../types/requestsTypes";
import {
  getMyRequests,
  cancelRequest,
  reviewRequest,
  createRequest,
  uploadFiles,
} from "../AsyncThunks/requestsThunks";

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: RequestsState = {
  requests: [],
  loading: {
    fetch: false,
    create: false,
    cancel: false,
    review: false,
    upload: false,
  },
  error: null,
  page: 1,
  limit: 8,
  totalPages: 1,
  totalItems: 0,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    // Manually clear error (e.g. on modal close)
    clearError(state) {
      state.error = null;
    },
    // Allow external reset (e.g. on logout)
    resetRequests() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ── getMyRequests ─────────────────────────────────────────────────────────
    builder
      .addCase(getMyRequests.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(getMyRequests.fulfilled, (state, { payload }) => {
        state.loading.fetch = false;
        state.requests = payload.data;
        state.totalItems = payload.results;
        state.totalPages = payload.totalPages;
        state.page = payload.page;
      })
      .addCase(getMyRequests.rejected, (state, { payload }) => {
        state.loading.fetch = false;
        state.error = payload ?? "Failed to fetch requests.";
      });

    // ── cancelRequest ─────────────────────────────────────────────────────────
    builder
      .addCase(cancelRequest.pending, (state) => {
        state.loading.cancel = true;
        state.error = null;
      })
      .addCase(cancelRequest.fulfilled, (state, { payload }) => {
        state.loading.cancel = false;
        // Replace the updated request in-place using _id
        const idx = state.requests.findIndex((r) => r._id === payload._id);
        if (idx !== -1) state.requests[idx] = payload;
      })
      .addCase(cancelRequest.rejected, (state, { payload }) => {
        state.loading.cancel = false;
        state.error = payload ?? "Failed to cancel request.";
      });

    // ── reviewRequest ─────────────────────────────────────────────────────────
    builder
      .addCase(reviewRequest.pending, (state) => {
        state.loading.review = true;
        state.error = null;
      })
      .addCase(reviewRequest.fulfilled, (state, { payload }) => {
        state.loading.review = false;
        const idx = state.requests.findIndex((r) => r._id === payload._id);
        if (idx !== -1) state.requests[idx] = payload;
      })
      .addCase(reviewRequest.rejected, (state, { payload }) => {
        state.loading.review = false;
        state.error = payload ?? "Failed to review request.";
      });

    // ── createRequest ─────────────────────────────────────────────────────────
    builder
      .addCase(createRequest.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, { payload }) => {
        state.loading.create = false;
        // Prepend so the newest request appears first
        state.requests.unshift(payload);
        state.totalItems += 1;
      })
      .addCase(createRequest.rejected, (state, { payload }) => {
        state.loading.create = false;
        state.error = payload ?? "Failed to create request.";
      });

    // ── uploadFiles ───────────────────────────────────────────────────────────
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.loading.upload = true;
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state, { payload }) => {
        state.loading.upload = false;
        const idx = state.requests.findIndex((r) => r._id === payload._id);
        if (idx !== -1) state.requests[idx] = payload;
      })
      .addCase(uploadFiles.rejected, (state, { payload }) => {
        state.loading.upload = false;
        state.error = payload ?? "Failed to upload files.";
      });
  },
});

export const { clearError, resetRequests } = requestsSlice.actions;
export default requestsSlice.reducer;
