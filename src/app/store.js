import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import trophyReducer from './slices/trophySlice';
import shopReducer from './slices/shopSlice'
import libraryReducer from './slices/librarySlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['userData', 'currentUserId', 'permanentUsers'],
};

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['userData', 'currentUserId', 'permanentUsers'],
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


const persistConfig = {
  key: 'shop',
  storage,
  whitelist: ['userData', 'currentUserId', 'permanentUsers'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedTrophyReducer = persistReducer(trophyPersistConfig, trophyReducer);
const persistedShopReducer = persistReducer(persistConfig, shopReducer);
const persistedLibraryReducer = persistReducer(libraryPersistConfig, libraryReducer);

export const store = configureStore({
  reducer: {
      auth: persistedAuthReducer,
      library: persistedLibraryReducer,
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
export default store;
