import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import libraryReducer from './slices/librarySlice'
import genrePlatformSlice from './slices/genrePlatformSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    library: libraryReducer,
    genres: genrePlatformSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['library.lastUpdated'],
      },
    }),
})