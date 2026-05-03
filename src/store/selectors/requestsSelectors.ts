import type { RootState } from "../store";

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectRequests = (state: RootState) => state.requests.requests;
export const selectRequestsError = (state: RootState) => state.requests.error;

// Granular loading selectors — components only subscribe to what they need
export const selectFetchLoading = (state: RootState) =>
  state.requests.loading.fetch;
export const selectCreateLoading = (state: RootState) =>
  state.requests.loading.create;
export const selectCancelLoading = (state: RootState) =>
  state.requests.loading.cancel;
export const selectReviewLoading = (state: RootState) =>
  state.requests.loading.review;
export const selectUploadLoading = (state: RootState) =>
  state.requests.loading.upload;

// Pagination
export const selectPagination = (state: RootState) => ({
  page: state.requests.page,
  limit: state.requests.limit,
  totalPages: state.requests.totalPages,
  totalItems: state.requests.totalItems,
});
