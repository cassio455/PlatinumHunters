import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import libraryReducer from './slices/librarySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    library: libraryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['library.lastUpdated'],
      },
    }),
})