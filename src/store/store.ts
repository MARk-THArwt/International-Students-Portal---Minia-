import { configureStore } from "@reduxjs/toolkit";
import servicesReducer from "./slices/servicesslice";
import requestsReducer from "./slices/requestsSlice";
import authReducer from "./slices/authSlice";
import eventsReducer from "./slices/eventsSlice";
import reportsReducer from "./slices/reportsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    requests: requestsReducer,
    events: eventsReducer,
    reports: reportsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
