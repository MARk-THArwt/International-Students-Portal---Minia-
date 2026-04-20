import { configureStore } from '@reduxjs/toolkit'
import  servicesReducer  from './slices/servicesslice'
import  requestsReducer  from './slices/requestsSlice'

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    requests: requestsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch