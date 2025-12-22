import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  genresList: [],   
  platformsList: [],   
  loading: false,
  error: null,
};

export const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setGames: (state, action) => {
      state.items = action.payload;
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


    setGenres: (state, action) => {
      state.genresList = action.payload;
    },

    setPlatforms: (state, action) => {
      state.platformsList = action.payload;
    },
  },
});

export const {
  setGames,
  setLoading,
  setError,
  setGenres,    
  setPlatforms, 
} = gamesSlice.actions;

export default gamesSlice.reducer;