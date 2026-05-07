import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api, { extractErrorMessage } from "../../api/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MessageUser {
  _id: string;
  name: string;
  role: string;
  avatar: string | null;
}

export interface Message {
  _id: string;
  message: string;
  sender: MessageUser;
  receiver: MessageUser;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  with: MessageUser;
  messages: Message[];
  unreadCount: number;
}

interface ConversationsResponse {
  status: string;
  page?: number;
  totalPages?: number;
  results?: number;
  data: Conversation[];
}

// ─── State ───────────────────────────────────────────────────────────────────

export interface MessagesState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  loading: boolean;
  sendLoading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  conversations: [],
  selectedConversation: null,
  loading: false,
  sendLoading: false,
  error: null,
};

// ─── Thunks ──────────────────────────────────────────────────────────────────

/** Student: GET /messages/my */
export const getMyMessages = createAsyncThunk<
  ConversationsResponse,
  void,
  { rejectValue: string }
>("messages/getMyMessages", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<ConversationsResponse>("/messages/my");
    return res.data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

/** Staff/Admin: GET /messages/all */
export const getAllMessages = createAsyncThunk<
  ConversationsResponse,
  void,
  { rejectValue: string }
>("messages/getAllMessages", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<ConversationsResponse>("/messages/all");
    return res.data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

/** Student: POST /messages */
export const sendMessage = createAsyncThunk<
  Message,
  { message: string },
  { rejectValue: string }
>("messages/sendMessage", async (body, { rejectWithValue }) => {
  try {
    const res = await api.post<{ data: Message }>("/messages", body);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

/** Staff/Admin: POST /messages/reply */
export const replyMessage = createAsyncThunk<
  Message,
  { message: string; studentId: string },
  { rejectValue: string }
>("messages/replyMessage", async (body, { rejectWithValue }) => {
  try {
    const res = await api.post<{ data: Message }>("/messages/reply", body);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Handle conversations response: store and auto-select first */
function applyConversations(state: MessagesState, conversations: Conversation[]) {
  state.conversations = conversations;
  // Sync selectedConversation with fresh data (keeps scroll position etc.)
  if (state.selectedConversation) {
    const updated = conversations.find((c) => c.with._id === state.selectedConversation!.with._id);
    state.selectedConversation = updated ?? null;
  }
  // Auto-select first conversation if none selected
  if (!state.selectedConversation && conversations.length > 0) {
    state.selectedConversation = conversations[0];
  }
}

/** Append a new message to the correct conversation and sync selectedConversation */
function appendMessage(state: MessagesState, msg: Message, partnerId: string) {
  const conv = state.conversations.find((c) => c.with._id === partnerId);
  if (conv) {
    // Avoid duplicate
    if (!conv.messages.find((m) => m._id === msg._id)) {
      conv.messages.push(msg);
    }
    if (state.selectedConversation?.with._id === partnerId) {
      state.selectedConversation = { ...conv };
    }
  }
}

// ─── Slice ───────────────────────────────────────────────────────────────────

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setSelectedConversation(state, action: PayloadAction<Conversation | null>) {
      state.selectedConversation = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── getMyMessages ──
    builder
      .addCase(getMyMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyMessages.fulfilled, (state, { payload }) => {
        state.loading = false;
        applyConversations(state, payload.data ?? []);
      })
      .addCase(getMyMessages.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Failed to load conversations";
      });

    // ── getAllMessages ──
    builder
      .addCase(getAllMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMessages.fulfilled, (state, { payload }) => {
        state.loading = false;
        applyConversations(state, payload.data ?? []);
      })
      .addCase(getAllMessages.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Failed to load conversations";
      });

    // ── sendMessage (Student → Staff) ──
    builder
      .addCase(sendMessage.pending, (state) => { state.sendLoading = true; })
      .addCase(sendMessage.fulfilled, (state, { payload }) => {
        state.sendLoading = false;
        if (payload) {
          // partner is the receiver
          appendMessage(state, payload, payload.receiver._id);
        }
      })
      .addCase(sendMessage.rejected, (state, { payload }) => {
        state.sendLoading = false;
        state.error = payload ?? "Failed to send message";
      });

    // ── replyMessage (Staff/Admin → Student) ──
    builder
      .addCase(replyMessage.pending, (state) => { state.sendLoading = true; })
      .addCase(replyMessage.fulfilled, (state, { payload }) => {
        state.sendLoading = false;
        if (payload) {
          // partner is the receiver (the student)
          appendMessage(state, payload, payload.receiver._id);
        }
      })
      .addCase(replyMessage.rejected, (state, { payload }) => {
        state.sendLoading = false;
        state.error = payload ?? "Failed to send reply";
      });
  },
});

export const { setSelectedConversation, clearError } = messagesSlice.actions;
export default messagesSlice.reducer;