import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../api/api";
import axios from "axios";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  _id?: string; // Some parts of the app use _id
  name: string;
  email: string;
  role: string;
  avatar: string | null;
<<<<<<< HEAD
  studentId?: string;
  passportNumber?: string;
  nationality?: string;
  phone?: string;
=======
  studentId: string;
  passportNumber: string;
  nationality: string;
  phone: string;
  gender: string;
>>>>>>> 259bbe9a6d7e5aa39d4f504b802e6bbc99efd11e
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// ─── Helper for Error ────────────────────────────────────────────────────────
function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData: any = error.response?.data;
    if (responseData?.message && typeof responseData.message === "string") {
      return responseData.message;
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

// ─── Async Thunks ──────────────────────────────────────────────────────────────

// LOGIN
export const login = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{
      status: string;
      message: string;
      user: User;
    }>("/auth/login", credentials);
    
    // Persist user in localStorage
    localStorage.setItem("user", JSON.stringify(response.data.user));
    
    // Return user object directly
    return response.data.user;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// REGISTER
export const register = createAsyncThunk<
  User,
  RegisterData,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ user: User }>("/auth/register", userData);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data.user;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// LOGOUT
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      // Remove from localStorage on successful logout
      localStorage.removeItem("user");
    } catch (err: unknown) {
      // Clear localStorage even if the request fails
      localStorage.removeItem("user");
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

// FETCH CURRENT USER
export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/me", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<{ user: User }>("/auth/me");
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data.user;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// ─── Initial State ─────────────────────────────────────────────────────────────

const getInitialUser = (): User | null => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

const initialState: AuthState = {
  user: getInitialUser(),
  loading: false,
  error: null,
};

// ─── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload; // payload is response.data.user
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Login failed";
      });

    // REGISTER
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Registration failed";
      });

    // LOGOUT
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.user = null; // Still clear user on logout rejection
      });

    // FETCH CURRENT USER
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

// ─── Actions ───────────────────────────────────────────────────────────────────

export const { clearError, setUser } = authSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export type RootState = { auth: AuthState };

export const selectUser = (state: RootState) => state.auth.user;
// isAuthenticated is dynamically derived from presence of user
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;
export const selectAuthError = (state: RootState) => state.auth.error;
// Changed to ignore key and return the unified boolean state
export const selectAuthLoading = (_key?: string) => (state: RootState) => state.auth.loading;

// ─── Reducer ───────────────────────────────────────────────────────────────────

export default authSlice.reducer;
