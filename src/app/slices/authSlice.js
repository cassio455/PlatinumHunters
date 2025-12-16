import { createSlice } from '@reduxjs/toolkit';
import * as rankingThunks from '../thunks/rankingThunks'; 

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      
      state.user = {
        ...action.payload.user,
        completedChallenges: action.payload.user.completedChallenges || [],
        coins: action.payload.user.coins || 0,
        rankingPoints: action.payload.user.rankingPoints || 0,
        ownedTitles: action.payload.user.ownedTitles || [],
        equippedTitle: action.payload.user.equippedTitle || null,
      };
      
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(rankingThunks.completeChallengeAPI.fulfilled, (state, action) => {
      if (state.user) {
        state.user.rankingPoints = action.payload.newPoints; 
        state.user.completedChallenges = action.payload.completedChallenges;
        
        if (action.payload.newCoins !== undefined) {
             state.user.coins = action.payload.newCoins;
        }
      }
    });
    builder.addCase(rankingThunks.deleteChallengeAPI.fulfilled, (state, action) => {
        if (state.user && state.user.completedChallenges) {
            const dayDeleted = action.payload;
            state.user.completedChallenges = state.user.completedChallenges.filter(day => day !== dayDeleted);
        }
    });
  }
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;