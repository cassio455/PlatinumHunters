import { createSlice } from '@reduxjs/toolkit';
import { loginSuccess, logout } from './authSlice'; 
import { buyTitleAPI, equipTitleAPI, fetchTitlesList, saveTitleAPI, deleteTitleAPI } from '../thunks/shopThunks'; 
import { completeChallengeAPI } from '../thunks/rankingThunks';

const initialState = {
  coins: 0,
  ownedTitles: [],
  equippedTitle: null,
  availableTitles: [],
  loading: false,
  error: null
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginSuccess, (state, action) => {
      const user = action.payload.user;
      state.coins = user.coins || 0;
      state.ownedTitles = user.ownedTitles || [];
      state.equippedTitle = user.equippedTitle || null;
    });

    builder.addCase(completeChallengeAPI.fulfilled, (state, action) => {
        if(action.payload.newCoins !== undefined) state.coins = action.payload.newCoins;
    });

    builder.addCase(buyTitleAPI.fulfilled, (state, action) => {
      state.loading = false;
      state.coins = action.payload.coins;
      state.ownedTitles = action.payload.ownedTitles;
    });
    builder.addCase(equipTitleAPI.fulfilled, (state, action) => {
      state.equippedTitle = action.payload.title;
    });

    builder.addCase(fetchTitlesList.fulfilled, (state, action) => {
        state.availableTitles = action.payload;
    });

    builder.addCase(saveTitleAPI.fulfilled, (state, action) => {
        const saved = action.payload;
        const index = state.availableTitles.findIndex(t => t._id === saved._id);
        if (index !== -1) {
            state.availableTitles[index] = saved;
        } else {
            state.availableTitles.push(saved);
        }
    });

    builder.addCase(deleteTitleAPI.fulfilled, (state, action) => {
        state.availableTitles = state.availableTitles.filter(t => t._id !== action.payload);
    });

    builder.addCase(logout, (state) => {
      state.coins = 0;
      state.ownedTitles = [];
      state.equippedTitle = null;
    });
  },
});

export default shopSlice.reducer;