import { createSlice } from '@reduxjs/toolkit';
import { completeChallengeAPI } from '../thunks/rankingThunks'; 

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
      
      // Garantia de integridade dos dados ao logar
      state.user = {
        ...action.payload.user,
        // Se vier undefined, forçamos um array/valor padrão para não quebrar a tela
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
    builder.addCase(completeChallengeAPI.fulfilled, (state, action) => {
      if (state.user) {
        state.user.rankingPoints = action.payload.newPoints; 
        state.user.completedChallenges = action.payload.completedChallenges;
        
        if (action.payload.newCoins !== undefined) {
             state.user.coins = action.payload.newCoins;
        }
      }
    });
  }
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;