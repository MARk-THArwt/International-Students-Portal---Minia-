import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../api/api";
import axios from "axios";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface User {
  _id?: string; 
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  studentId?: string;
  passportNumber?: string;
  nationality?: string;
  phone?: string;
  gender: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
}

export interface StudentRegisterData {
  name: string;
  email: string;
  password?: string;
  studentId: string;
  passportNumber: string;
  nationality: string;
  phone: string;
  gender: string;
  avatar?: File;
}

export interface StaffRegisterData {
  name: string;
  email: string;
  password?: string;
  employeeId: string;
  role: string;
  department: string;
  avatar?: File;
}

export interface AdminRegisterData {
  name: string;
  email: string;
  password?: string;
  employeeId: string;
  role?: string;
  avatar?: File;
}

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
}

export interface PaginatedUsersResponse {
  status: string;
  results: number;
  totalPages: number;
  page: number;
  limit: number;
  data: User[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  // Management State
  users: User[];
  usersPagination: {
    page: number;
    limit: number;
    total: number;
  };
  usersLoading: boolean;
  usersError: string | null;
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

// REGISTER (Old functionality kept intact)
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

// REGISTER STUDENT
export const registerStudent = createAsyncThunk<
  User,
  StudentRegisterData,
  { rejectValue: string }
>("auth/registerStudent", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (data.password) formData.append("password", data.password);
    formData.append("studentId", data.studentId);
    formData.append("passportNumber", data.passportNumber);
    formData.append("nationality", data.nationality);
    formData.append("phone", data.phone);
    formData.append("gender", data.gender);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    const response = await axiosInstance.post<{ user: User }>(
      "/auth/register/student",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data.user;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// REGISTER STAFF
export const registerStaff = createAsyncThunk<
  User,
  StaffRegisterData,
  { rejectValue: string }
>("auth/registerStaff", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (data.password) formData.append("password", data.password);
    formData.append("employeeId", data.employeeId);
    formData.append("role", data.role);
    formData.append("department", data.department);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    const response = await axiosInstance.post<{ user: User }>(
      "/auth/register/employee",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data.user;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// REGISTER ADMIN
export const registerAdmin = createAsyncThunk<
  User,
  AdminRegisterData,
  { rejectValue: string }
>("auth/registerAdmin", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (data.password) formData.append("password", data.password);
    formData.append("employeeId", data.employeeId);
    formData.append("role", data.role || "admin");
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    const response = await axiosInstance.post<{ user: User }>(
      "/auth/register/employee",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data.user;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// GET ALL USERS
export const getAllUsers = createAsyncThunk<
  PaginatedUsersResponse,
  GetAllUsersParams,
  { rejectValue: string }
>("auth/getAllUsers", async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<PaginatedUsersResponse>("/auth/users", {
      params: { page, limit },
    });
    return response.data;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// DELETE USER
export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("auth/deleteUser", async (userId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/auth/users/${userId}`);
    return userId;
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

  users: [],
  usersPagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  usersLoading: false,
  usersError: null,
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

    // REGISTER (Old)
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

    // REGISTER STUDENT
    builder
      .addCase(registerStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStudent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(registerStudent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Student registration failed";
      });

    // REGISTER STAFF
    builder
      .addCase(registerStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStaff.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(registerStaff.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Staff registration failed";
      });

    // REGISTER ADMIN
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(registerAdmin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Admin registration failed";
      });

    // GET ALL USERS
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(getAllUsers.fulfilled, (state, { payload }) => {
        state.usersLoading = false;
        state.users = payload.data;
        state.usersPagination = {
          page: payload.page,
          limit: payload.limit,
          total: payload.results,
        };
      })
      .addCase(getAllUsers.rejected, (state, { payload }) => {
        state.usersLoading = false;
        state.usersError = payload ?? "Failed to fetch users";
      });

    // DELETE USER
    builder
      .addCase(deleteUser.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.usersLoading = false;
        state.users = state.users.filter((u) => u._id !== payload);
      })
      .addCase(deleteUser.rejected, (state, { payload }) => {
        state.usersLoading = false;
        state.usersError = payload ?? "Failed to delete user";
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
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (_key?: string) => (state: RootState) => state.auth.loading;

export const selectAllUsers = (state: RootState) => state.auth.users;
export const selectUsersPagination = (state: RootState) => state.auth.usersPagination;
export const selectUsersLoading = (state: RootState) => state.auth.usersLoading;
export const selectUsersError = (state: RootState) => state.auth.usersError;

// ─── Reducer ───────────────────────────────────────────────────────────────────

export default authSlice.reducer;
