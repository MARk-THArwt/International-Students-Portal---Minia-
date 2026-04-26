import { configureStore } from '@reduxjs/toolkit'
import  servicesReducer  from './slices/servicesslice'
import  requestsReducer  from './slices/requestsSlice'
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    requests: requestsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch