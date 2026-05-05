import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api, { extractErrorMessage } from "../../api/api";

// ================== TYPES ==================

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
}

export interface GetEventsParams {
  page?: number;
  limit?: number;
}

export interface PaginatedEventsResponse {
  status: string;
  page: number;
  results: number;
  totalPages: number;
  data: Event[];
}

export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  location: string;
}

export interface UpdateEventPayload {
  eventId: string;
  data: Partial<CreateEventPayload>;
}

// ================== THUNKS ==================

export const getEvents = createAsyncThunk<
  PaginatedEventsResponse,
  GetEventsParams | undefined,
  { rejectValue: string }
>("events/getEvents", async (params = { page: 1, limit: 8 }, { rejectWithValue }) => {
  try {
    const { data } = await api.get<PaginatedEventsResponse>("/events", {
      params,
    });
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const createEvent = createAsyncThunk<
  Event,
  CreateEventPayload,
  { rejectValue: string }
>("events/createEvent", async (eventData, { rejectWithValue }) => {
  try {
    // Note: Assuming API returns { data: Event } or just Event directly. 
    // Adapting to typical REST patterns (e.g. response.data.data if wrapped)
    const { data } = await api.post<{ data: Event } | Event>("/events", eventData);
    // Handle standard vs wrapped response formats seamlessly
    return "data" in data && data.data && typeof data.data === "object" ? data.data : (data as Event);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateEvent = createAsyncThunk<
  Event,
  UpdateEventPayload,
  { rejectValue: string }
>(
  "events/updateEvent",
  async ({ eventId, data: updateData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<{ data: Event } | Event>(
        `/events/${eventId}`,
        updateData
      );

      return "data" in data && typeof data.data === "object"
        ? data.data
        : (data as Event);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const deleteEvent = createAsyncThunk<
  string, // Return eventId to remove it from state
  string,
  { rejectValue: string }
>("events/deleteEvent", async (eventId, { rejectWithValue }) => {
  try {
    await api.delete(`/events/${eventId}`);
    return eventId;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// ================== SLICE ==================

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEventError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --- GET EVENTS ---
    builder
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.events = payload.data;
        state.page = payload.page;
        state.totalPages = payload.totalPages;
      })
      .addCase(getEvents.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Failed to fetch events";
      });

    // --- CREATE EVENT ---
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.events.unshift(payload); // Add new event to top of list
      })
      .addCase(createEvent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Failed to create event";
      });

    // --- UPDATE EVENT ---
    builder
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, { payload }) => {
        state.loading = false;
        const index = state.events.findIndex((e) => e._id === payload._id);
        if (index !== -1) {
          state.events[index] = payload;
        }
      })
      .addCase(updateEvent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Failed to update event";
      });

    // --- DELETE EVENT ---
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, { payload: eventId }) => {
        state.loading = false;
        state.events = state.events.filter((e) => e._id !== eventId);
      })
      .addCase(deleteEvent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Failed to delete event";
      });
  },
});

export const { clearEventError } = eventsSlice.actions;

// Selectors
export const selectEventsState = (state: { events: EventsState }) => state.events;

export default eventsSlice.reducer;
