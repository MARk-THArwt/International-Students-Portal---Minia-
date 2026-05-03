import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import api, { extractErrorMessage } from "../../api/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReportSummary {
  totalRequests: number;
  totalServices: number;
  totalStudents: number;
}

export interface StatusReportItem {
  status: string;
  count: number;
}

export interface ServicesReportItem {
  _id: string;
  serviceName: string;
  count: number;
}

export interface StudentsReportItem {
  _id: string;
  studentName: string;
  count: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReportsState {
  summary: ReportSummary | null;

  statusReport: StatusReportItem[];
  statusMeta: PaginatedMeta | null;

  servicesReport: ServicesReportItem[];
  servicesMeta: PaginatedMeta | null;

  studentsReport: StudentsReportItem[];
  studentsMeta: PaginatedMeta | null;

  loading: boolean;
  error: string | null;
}

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchSummary = createAsyncThunk<
  ReportSummary,
  void,
  { rejectValue: string }
>("reports/fetchSummary", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/reports/summary");
    // Handle cases where the backend wraps the response in a 'data' object
    const payload = response.data.data ? response.data.data : response.data;
    return payload as ReportSummary;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const fetchStatusReport = createAsyncThunk<
  { data: StatusReportItem[]; meta: PaginatedMeta },
  PaginationParams,
  { rejectValue: string }
>(
  "reports/fetchStatusReport",
  async ({ page = 1, limit = 8 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/reports/status", {
        params: { page, limit },
      });
      // Support both { data, meta } and plain array responses
      if (Array.isArray(data)) {
        return {
          data,
          meta: { page, limit, total: data.length, totalPages: 1 },
        };
      }
      return data as { data: StatusReportItem[]; meta: PaginatedMeta };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchServicesReport = createAsyncThunk<
  { data: ServicesReportItem[]; meta: PaginatedMeta },
  PaginationParams,
  { rejectValue: string }
>(
  "reports/fetchServicesReport",
  async ({ page = 1, limit = 8 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/reports/services", {
        params: { page, limit },
      });
      if (Array.isArray(data)) {
        return {
          data,
          meta: { page, limit, total: data.length, totalPages: 1 },
        };
      }
      return data as { data: ServicesReportItem[]; meta: PaginatedMeta };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchStudentsReport = createAsyncThunk<
  { data: StudentsReportItem[]; meta: PaginatedMeta },
  PaginationParams,
  { rejectValue: string }
>(
  "reports/fetchStudentsReport",
  async ({ page = 1, limit = 8 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/reports/students", {
        params: { page, limit },
      });
      if (Array.isArray(data)) {
        return {
          data,
          meta: { page, limit, total: data.length, totalPages: 1 },
        };
      }
      return data as { data: StudentsReportItem[]; meta: PaginatedMeta };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: ReportsState = {
  summary: null,

  statusReport: [],
  statusMeta: null,

  servicesReport: [],
  servicesMeta: null,

  studentsReport: [],
  studentsMeta: null,

  loading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReportsError(state) {
      state.error = null;
    },
    resetReports() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Helper: mark global loading on pending
    const setPending = (state: ReportsState) => {
      state.loading = true;
      state.error = null;
    };
    const setRejected = (
      state: ReportsState,
      action: { payload?: string }
    ) => {
      state.loading = false;
      state.error = action.payload ?? "Something went wrong";
    };

    // ── fetchSummary ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchSummary.pending, setPending)
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, setRejected);

    // ── fetchStatusReport ─────────────────────────────────────────────────────
    builder
      .addCase(fetchStatusReport.pending, setPending)
      .addCase(fetchStatusReport.fulfilled, (state, action) => {
        state.loading = false;
        state.statusReport = action.payload.data;
        state.statusMeta = action.payload.meta;
      })
      .addCase(fetchStatusReport.rejected, setRejected);

    // ── fetchServicesReport ───────────────────────────────────────────────────
    builder
      .addCase(fetchServicesReport.pending, setPending)
      .addCase(fetchServicesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.servicesReport = action.payload.data;
        state.servicesMeta = action.payload.meta;
      })
      .addCase(fetchServicesReport.rejected, setRejected);

    // ── fetchStudentsReport ───────────────────────────────────────────────────
    builder
      .addCase(fetchStudentsReport.pending, setPending)
      .addCase(fetchStudentsReport.fulfilled, (state, action) => {
        state.loading = false;
        state.studentsReport = action.payload.data;
        state.studentsMeta = action.payload.meta;
      })
      .addCase(fetchStudentsReport.rejected, setRejected);
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const { clearReportsError, resetReports } = reportsSlice.actions;

// ─── Reducer ──────────────────────────────────────────────────────────────────

export default reportsSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectReportsSummary = (state: RootState) =>
  state.reports.summary;
export const selectStatusReport = (state: RootState) =>
  state.reports.statusReport;
export const selectServicesReport = (state: RootState) =>
  state.reports.servicesReport;
export const selectStudentsReport = (state: RootState) =>
  state.reports.studentsReport;
export const selectReportsLoading = (state: RootState) =>
  state.reports.loading;
export const selectReportsError = (state: RootState) => state.reports.error;
export const selectStatusMeta = (state: RootState) => state.reports.statusMeta;
export const selectServicesMeta = (state: RootState) =>
  state.reports.servicesMeta;
export const selectStudentsMeta = (state: RootState) =>
  state.reports.studentsMeta;
