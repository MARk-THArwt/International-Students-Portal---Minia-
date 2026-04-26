import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
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

export interface AuthLoadingState {
  login: boolean;
  register: boolean;
  logout: boolean;
  fetchUser: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: AuthLoadingState;
  error: string | null;
}

// ─── Config ────────────────────────────────────────────────────────────────────

const API_URL =
  "https://internationalstudentsportal-production-5e18.up.railway.app/api";

// ─── Helper (with cookies) ─────────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include", // 🔥 أهم سطر
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? "Request failed");
  }

  return data as T;
}

// ─── Async Thunks ──────────────────────────────────────────────────────────────

// LOGIN
export const login = createAsyncThunk<
  { user: User },
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await apiFetch<{ user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

// REGISTER
export const register = createAsyncThunk<
  { user: User },
  RegisterData,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const data = await apiFetch<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

// LOGOUT
export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await apiFetch("/auth/logout", {
      method: "POST",
    });
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

// FETCH CURRENT USER
export const fetchCurrentUser = createAsyncThunk<
  { user: User },
  void,
  { rejectValue: string }
>("auth/me", async (_, { rejectWithValue }) => {
  try {
    return await apiFetch<{ user: User }>("/auth/me");
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: {
    login: false,
    register: false,
    logout: false,
    fetchUser: false,
  },
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
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.loading.login = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading.login = false;
        state.user = payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading.login = false;
        state.error = payload ?? "Login failed";
      });

    // REGISTER
    builder
      .addCase(register.pending, (state) => {
        state.loading.register = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading.register = false;
        state.user = payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading.register = false;
        state.error = payload ?? "Registration failed";
      });

    // LOGOUT
    builder
      .addCase(logout.pending, (state) => {
        state.loading.logout = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading.logout = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading.logout = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // FETCH USER
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading.fetchUser = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.loading.fetchUser = false;
        state.user = payload.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading.fetchUser = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// ─── Actions ───────────────────────────────────────────────────────────────────

export const { clearError, setUser } = authSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export type RootState = { auth: AuthState };

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading =
  (key: keyof AuthLoadingState) => (state: RootState) =>
    state.auth.loading[key];

// ─── Reducer ───────────────────────────────────────────────────────────────────

export default authSlice.reducer;