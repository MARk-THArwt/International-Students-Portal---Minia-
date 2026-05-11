import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import api, { extractErrorMessage } from "../../api/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AppNotification {
  _id: string;
  user: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  status: string;
  page: number;
  results: number;
  totalPages: number;
  data: AppNotification[];
}

export interface NotificationsState {
  notifications: AppNotification[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  unreadCount: 0,
};

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const getMyNotifications = createAsyncThunk<
  NotificationsResponse,
  { page?: number; limit?: number } | void,
  { rejectValue: string }
>("notifications/getMyNotifications", async (args, { rejectWithValue }) => {
  try {
    const page = args?.page || 1;
    const limit = args?.limit || 8;
    const res = await api.get<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const markNotificationAsRead = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("notifications/markAsRead", async (notificationId, { rejectWithValue }) => {
  try {
    const res = await api.put(`/notifications/${notificationId}/read`);
    return res.data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// ─── Slice ───────────────────────────────────────────────────────────────────

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyNotifications.fulfilled, (state, action) => {
        state.loading = false;
        
        // Sort newest -> oldest automatically
        const sortedData = [...action.payload.data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        state.notifications = sortedData;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;

        // Calculate unread count
        state.unreadCount = sortedData.filter((n) => !n.isRead).length;
      })
      .addCase(getMyNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load notifications";
      })
      // Optimistic update for markAsRead
      .addCase(markNotificationAsRead.pending, (state, action) => {
        const notifId = action.meta.arg;
        const notif = state.notifications.find((n) => n._id === notifId);
        if (notif && !notif.isRead) {
          notif.isRead = true;
          state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        const notifId = action.meta.arg;
        const notif = state.notifications.find((n) => n._id === notifId);
        if (notif) {
          notif.isRead = false; // Rollback on error
          state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
        }
      });
  },
});

export const { markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
