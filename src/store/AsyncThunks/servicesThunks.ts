import {
  createAsyncThunk,} from '@reduxjs/toolkit'
  import axiosInstance from "../../api/api";
  import axios from 'axios'
  import type {Service,UpdateServicePayload,ApiItemResponse,ApiListResponse} from "../types/servicesType"

  // ────────────────────────────────────────────
  // Error-handling utility
  // ─────────────────────────────────────────────
  
  /**
   * Extracts a human-readable message from an unknown error thrown inside a
   * createAsyncThunk.  Never uses `any`; relies on Axios's own type guard and
   * the standard Error prototype chain.
   *
   * Priority:
   *  1. Axios response body  → `error.response.data.message` (string)
   *  2. Axios response body  → JSON.stringify if not a string
   *  3. Plain JS Error       → `error.message`
   *  4. Fallback string      → "An unexpected error occurred"
   */
  
  
  function extractErrorMessage(error: unknown): string {
    // ── Axios error path ───────────────────────────────────────────────────────
    if (axios.isAxiosError(error)) {
      // `error.response?.data` is typed as `unknown` in axios ≥ 1.x
      const responseData: unknown = error.response?.data;
  
      if (responseData !== null && responseData !== undefined) {
        // Many APIs return { message: "..." }
        if (
          typeof responseData === "object" &&
          "message" in responseData &&
          typeof (responseData as Record<string, unknown>).message === "string"
        ) {
          return (responseData as Record<string, string>).message;
        }
  
        // Some APIs return a plain string body
        if (typeof responseData === "string" && responseData.length > 0) {
          return responseData;
        }
  
        // Last resort: serialize whatever the server sent
        return JSON.stringify(responseData);
      }
  
      // Network-level Axios message (e.g. "Network Error", "timeout of 5000ms exceeded")
      return error.message;
    }
  
    // ── Standard JS Error path ─────────────────────────────────────────────────
    if (error instanceof Error) {
      return error.message;
    }
  
    // ── Completely unknown thrown value ────────────────────────────────────────
    return "An unexpected error occurred";
  }
export const getServices = createAsyncThunk<
  ApiListResponse<Service>,   // fulfilled payload type
  void,                        // argument type (none needed)
  { rejectValue: string }      // thunk config
>("services/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiListResponse<Service>>(
      `/services`);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

/**
 * Updates a specific service by id.
 * Sends only the changed fields (PATCH semantics).
 */
export const updateService = createAsyncThunk<
  Service,                     // fulfilled payload: the updated service
  UpdateServicePayload,        // argument: { id, data }
  { rejectValue: string }
>("services/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<ApiItemResponse<Service>>(
      `/services/${id}`,
      data
    );
    return response.data.data;
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

/**
 * Deletes a specific service by id.
 * Returns the deleted id so the reducer can splice it from state without
 * needing to re-fetch the list.
 */
export const deleteService = createAsyncThunk<
  string,                      // fulfilled payload: the deleted service's id
  string,                      // argument: the service id
  { rejectValue: string }
>("services/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/services/${id}`);
    return id;
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
