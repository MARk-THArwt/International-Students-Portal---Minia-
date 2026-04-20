import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {PayloadAction}from "@reduxjs/toolkit";
// ─── Types ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface AuthLoadingState {
  login: boolean;
  register: boolean;
  logout: boolean;
  refresh: boolean;
  fetchUser: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: AuthLoadingState;
  error: string | null;
}

// ─── Config ────────────────────────────────────────────────────────────────────

const API_URL = "https://internationalstudentsportal-production.up.railway.app/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function saveTokens(tokens: AuthTokens): void {
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
}

function clearTokens(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? "Request failed");
  }

  return data as T;
}

// ─── Async Thunks ──────────────────────────────────────────────────────────────

export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    saveTokens(data);
    return data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const data = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    saveTokens(data);
    return data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const logout = createAsyncThunk<
  void,
  void,
  { state: { auth: AuthState }; rejectValue: string }
>("auth/logout", async (_, { getState, rejectWithValue }) => {
  try {
    const { accessToken } = getState().auth;
    await apiFetch("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    });
  } catch (err) {
    return rejectWithValue((err as Error).message);
  } finally {
    clearTokens();
  }
});

export const refreshAccessToken = createAsyncThunk<
  RefreshResponse,
  void,
  { rejectValue: string }
>("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return rejectWithValue("No refresh token available");

    const data = await apiFetch<RefreshResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    localStorage.setItem("accessToken", data.accessToken);
    return data;
  } catch (err) {
    clearTokens();
    return rejectWithValue((err as Error).message);
  }
});

export const fetchCurrentUser = createAsyncThunk<
  { user: User },
  void,
  { state: { auth: AuthState }; rejectValue: string }
>("auth/me", async (_, { getState, rejectWithValue }) => {
  try {
    const { accessToken } = getState().auth;
    return await apiFetch<{ user: User }>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    });
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: Boolean(localStorage.getItem("accessToken")),
  loading: {
    login: false,
    register: false,
    logout: false,
    refresh: false,
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
    hydrateAuth(state) {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
      }
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading.login = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading.login = false;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading.login = false;
        state.error = payload ?? "Login failed";
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading.register = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading.register = false;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading.register = false;
        state.error = payload ?? "Registration failed";
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading.logout = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading.logout = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading.logout = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });

    // Refresh
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading.refresh = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, { payload }) => {
        state.loading.refresh = false;
        state.accessToken = payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshAccessToken.rejected, (state, { payload }) => {
        state.loading.refresh = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = payload ?? null;
      });

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading.fetchUser = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.loading.fetchUser = false;
        state.user = payload.user;
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.loading.fetchUser = false;
        state.error = payload ?? null;
      });
  },
});

// ─── Actions ───────────────────────────────────────────────────────────────────
export const { clearError, hydrateAuth, setUser } = authSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────
export type RootState = { auth: AuthState };

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading =
  (key: keyof AuthLoadingState) => (state: RootState) =>
    state.auth.loading[key];

export default authSlice.reducer;
