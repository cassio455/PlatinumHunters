import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Imports dos Slices
import authReducer from './slices/authSlice';
import trophyReducer from './slices/trophySlice';
import shopReducer from './slices/shopSlice';
import libraryReducer from './slices/librarySlice';
import genrePlatformReducer from './slices/genrePlatformSlice';
import gamesReducer from './slices/gamesSlice';
import rankingReducer from './slices/rankingSlice'; 
import guidesReducer from './slices/guidesSlice';

const authPersistConfig = { key: 'auth', storage };
const trophyPersistConfig = { key: 'trophies', storage };
const shopPersistConfig = { key: 'shop', storage };
const libraryPersistConfig = { key: 'library', storage };
const genrePlatformPersistConfig = { key: 'genrePlatform', storage };
const gamesPersistConfig = { key: 'games', storage };
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedTrophyReducer = persistReducer(trophyPersistConfig, trophyReducer);
const persistedShopReducer = persistReducer(shopPersistConfig, shopReducer); 
const persistedLibraryReducer = persistReducer(libraryPersistConfig, libraryReducer);
const persistedGenrePlatformReducer = persistReducer(genrePlatformPersistConfig, genrePlatformReducer);
const persistedGamesReducer = persistReducer(gamesPersistConfig, gamesReducer); 

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    library: persistedLibraryReducer,
    genrePlatform: persistedGenrePlatformReducer,
    trophies: persistedTrophyReducer,
    shop: persistedShopReducer,
    games: persistedGamesReducer, 
    ranking: rankingReducer,
    guides: guidesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);