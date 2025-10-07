import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  library: [],
  stats: {
    total: 0,
    jogando: 0,
    platinado: 0,
  },
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
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLibrary,
  addToLibrary,
  updateLibraryGame,
  removeFromLibrary,
  setLoading,
  setError,
} = librarySlice.actions;

export default librarySlice.reducer;
