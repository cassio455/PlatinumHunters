import { createSlice } from '@reduxjs/toolkit';
import { logout } from './authSlice';

const initialState = {
  userData: {},
  rankingPoints: 0,
  coins: 0,
  ownedTitles: [],
  equippedTitle: null,
  completedChallenges: [],
  currentUserId: null,
  permanentUsers: {}
};

const saveShopDataToUserData = (state) => {
  if (state.currentUserId) {
    if (!state.userData[state.currentUserId]) {
      state.userData[state.currentUserId] = {};
    }
    state.userData[state.currentUserId] = {
      rankingPoints: state.rankingPoints,
      coins: state.coins,
      ownedTitles: state.ownedTitles,
      equippedTitle: state.equippedTitle,
      completedChallenges: state.completedChallenges,
    };
  }
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      const userId = action.payload;
      state.currentUserId = userId;
      
      const currentUserData = state.userData[userId];
      if (currentUserData) {
        state.rankingPoints = currentUserData.rankingPoints || 0;
        state.coins = currentUserData.coins || 0;
        state.ownedTitles = currentUserData.ownedTitles || [];
        state.equippedTitle = currentUserData.equippedTitle || null;
        state.completedChallenges = currentUserData.completedChallenges || [];
      } else {
        state.rankingPoints = 0;
        state.coins = 0;
        state.ownedTitles = [];
        state.equippedTitle = null;
        state.completedChallenges = [];
        saveShopDataToUserData(state);
      }
    },
    
    buyTitle: (state, action) => {
      if (!state.currentUserId) return;
      const { name, cost } = action.payload;
      if (state.ownedTitles.includes(name) || state.coins < cost) return;
      
      state.coins -= cost;
      state.ownedTitles.push(name);
      saveShopDataToUserData(state);
    },
    
    equipTitle: (state, action) => {
      if (!state.currentUserId) return;
      const titleName = action.payload;
      if (state.ownedTitles.includes(titleName)) {
        state.equippedTitle = titleName;
        saveShopDataToUserData(state);
      }
    },
    
    addPoints: (state, action) => {
      if (!state.currentUserId) return;
      state.rankingPoints += action.payload;
      state.coins += action.payload;
      saveShopDataToUserData(state);
    },
    
    completeChallenge: (state, action) => {
      if (!state.currentUserId) return;
      const { day, points } = action.payload;
      if (state.completedChallenges.includes(day)) return;
      
      state.rankingPoints += points;
      state.coins += points;
      state.completedChallenges.push(day);
      saveShopDataToUserData(state);
    },

    savePermanentUserData: (state, action) => {
      const { userId, userData } = action.payload;
      state.permanentUsers[userId] = userData;
    },

    clearCurrentUser: (state) => {
      state.rankingPoints = 0;
      state.coins = 0;
      state.ownedTitles = [];
      state.equippedTitle = null;
      state.completedChallenges = [];
      state.currentUserId = null;
    },
    
    resetShop: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.rankingPoints = 0;
      state.coins = 0;
      state.ownedTitles = [];
      state.equippedTitle = null;
      state.completedChallenges = [];
      state.currentUserId = null;
    });
  },
});

export const { 
  setCurrentUser, 
  saveUserData,
  buyTitle, 
  equipTitle, 
  addPoints, 
  completeChallenge, 
  clearCurrentUser, 
  resetShop 
} = shopSlice.actions;

export default shopSlice.reducer;