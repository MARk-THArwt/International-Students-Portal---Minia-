import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store"; // adjust path to your store
import type {
  Service,
  ServicesState,
  LoadingStatus,
} from "../types/servicesType";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from "../AsyncThunks/servicesThunks";

// ─────────────────────────────────────────────
// 7.  Initial state
// ─────────────────────────────────────────────

const initialState: ServicesState = {
  services: [],
  loading: false,
  status: "idle",
  error: null,
};

// ─────────────────────────────────────────────
// 8.  Slice
// ─────────────────────────────────────────────

const servicesSlice = createSlice({
  name: "services",
  initialState,

  // ── Synchronous reducers ─────────────────────────────────────────────────
  reducers: {
    /**
     * Manually clear all errors.
     */
    clearError(state) {
      state.error = null;
    },
  },

  // ── Async thunk lifecycle handlers ───────────────────────────────────────
  extraReducers: (builder) => {
    // ── getAllServices ──────────────────────────────────────────────────────────
    builder
      .addCase(getAllServices.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.services = action.payload.data;
      })
      .addCase(getAllServices.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch services";
      })
      // ── createService ────────────────────────────────────────────────────────
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create service";
      })
      // ── updateService ────────────────────────────────────────────────────────
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.services.findIndex(
          (svc) => svc._id === action.payload._id,
        );
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update service";
      })
      // ── deleteService ────────────────────────────────────────────────────────
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter((svc) => svc._id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete service";
      });
  },
});

// ─────────────────────────────────────────────
// 9.  Exports — actions, reducer, selectors
// ─────────────────────────────────────────────

export const { clearError } = servicesSlice.actions;

export default servicesSlice.reducer;

// ── Selectors ────────────────────────────────────────────────────────────────

export const selectAllServices = (state: RootState): Service[] =>
  state.services.services || [];

export const selectServicesLoading = (state: RootState): boolean =>
  state.services.loading;

export const selectServicesStatus = (state: RootState): LoadingStatus =>
  state.services.status;

export const selectServicesError = (state: RootState): string | null =>
  state.services.error;

export const selectServiceById = (id: string) => (state: RootState) =>
  state.services.services.find((svc) => svc._id === id);

