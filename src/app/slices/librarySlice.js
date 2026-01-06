import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  library: [],
  stats: {
    total: 0,
    jogando: 0,
    platinado: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  lastFetched: null, // Timestamp for cache invalidation
  cachedUserId: null, // Track which user's data is cached
  cachedFilters: null, // Track which filters were applied to cached data
  loading: false,
  error: null,
};

const calculateStats = (library) => {
  const stats = {
    total: library.length,
    jogando: 0,
    platinado: 0,
  };

  library.forEach((game) => {
    if (game.status === 'jogando') {
      stats.jogando += 1;
    } else if (game.status === 'platinado') {
      stats.platinado += 1;
    }
  });

  return stats;
};

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setLibrary: (state, action) => {
      state.library = action.payload;
      state.stats = calculateStats(action.payload);
      state.loading = false;
      state.error = null;
    },
    
    addToLibrary: (state, action) => {
      state.library.push(action.payload);
      state.stats = calculateStats(state.library);
    },
    
    updateLibraryGame: (state, action) => {
      const index = state.library.findIndex(game => game.id === action.payload.id);
      if (index !== -1) {
        state.library[index] = { 
          ...state.library[index], 
          ...action.payload,
        };
        state.stats = calculateStats(state.library);
      }
    },
    
    removeFromLibrary: (state, action) => {
      state.library = state.library.filter(game => game.id !== action.payload);
      state.stats = calculateStats(state.library);
    },
    
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    
    setLastFetched: (state, action) => {
      state.lastFetched = action.payload.timestamp;
      state.cachedUserId = action.payload.userId;
      state.cachedFilters = action.payload.filters || null;
    },
    
    clearLibrary: (state) => {
      state.library = [];
      state.stats = { total: 0, jogando: 0, platinado: 0 };
      state.pagination = { page: 1, limit: 20, total: 0, totalPages: 0 };
      state.lastFetched = null;
      state.cachedUserId = null;
      state.cachedFilters = null;
      state.loading = false;
      state.error = null;
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLibrary,
  addToLibrary,
  updateLibraryGame,
  removeFromLibrary,
  setPagination,
  setLastFetched,
  clearLibrary,
  setLoading,
  setError,
  clearError,
} = librarySlice.actions;

// Selectors
export const selectLibrary = (state) => state.library.library;
export const selectLibraryStats = (state) => state.library.stats;
export const selectLibraryLoading = (state) => state.library.loading;
export const selectLibraryError = (state) => state.library.error;
export const selectLibraryPagination = (state) => state.library.pagination;
export const selectLibraryById = (gameId) => (state) => 
  state.library.library.find(item => item.gameId === gameId);
export const selectIsGameInLibrary = (gameId) => (state) =>
  state.library.library.some(item => item.gameId === gameId);

export default librarySlice.reducer;
