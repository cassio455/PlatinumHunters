import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import trophyReducer from './slices/trophySlice';
import shopReducer from './slices/shopSlice';
import libraryReducer from './slices/librarySlice';
import genrePlatformReducer from './slices/genrePlatformSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
};

const trophyPersistConfig = {
  key: 'trophies',
  storage,
  whitelist: ['userData', 'currentUserId'],
};

const libraryPersistConfig = {
  key: 'library',
  storage,
  whitelist: ['library', 'stats', 'currentUserId'],
};

const genrePlatformPersistConfig = {
  key: 'genrePlatform',
  storage,
  whitelist: ['genres', 'platforms'],
};

const shopPersistConfig = {
  key: 'shop',
  storage,
  whitelist: ['userData', 'currentUserId', 'permanentUsers'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedTrophyReducer = persistReducer(trophyPersistConfig, trophyReducer);
const persistedShopReducer = persistReducer(shopPersistConfig, shopReducer); 
const persistedLibraryReducer = persistReducer(libraryPersistConfig, libraryReducer);
const persistedGenrePlatformReducer = persistReducer(genrePlatformPersistConfig, genrePlatformReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    library: persistedLibraryReducer,
    genrePlatform: persistedGenrePlatformReducer,
    trophies: persistedTrophyReducer,
    shop: persistedShopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);