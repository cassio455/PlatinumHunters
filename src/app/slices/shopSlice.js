import { createSlice } from '@reduxjs/toolkit';

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

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      const userId = action.payload;
      state.currentUserId = userId;
      
      if (state.userData[userId]) {
        state.rankingPoints = state.userData[userId].rankingPoints || 0;
        state.coins = state.userData[userId].coins || 0;
        state.ownedTitles = state.userData[userId].ownedTitles;
        state.equippedTitle = state.userData[userId].equippedTitle;
        state.completedChallenges = state.userData[userId].completedChallenges;
      } else {
        state.rankingPoints = 0;
        state.coins = 0;
        state.ownedTitles = [];
        state.equippedTitle = null;
        state.completedChallenges = [];
        state.userData[userId] = {
          rankingPoints: 0,
          coins: 0,
          ownedTitles: [],
          equippedTitle: null,
          completedChallenges: [],
        };
      }
    },

    saveUserData: (state) => {
      if (state.currentUserId) {
        state.userData[state.currentUserId] = {
          rankingPoints: state.rankingPoints,
          coins: state.coins,
          ownedTitles: state.ownedTitles,
          equippedTitle: state.equippedTitle,
          completedChallenges: state.completedChallenges,
        };
      }
    },
    
    buyTitle: (state, action) => {
      const { name, cost } = action.payload;
      
      if (state.ownedTitles.includes(name)) return;
      if (state.coins < cost) return;
      
      state.coins -= cost;
      state.ownedTitles.push(name);
      
      if (state.currentUserId) {
        state.userData[state.currentUserId] = {
          rankingPoints: state.rankingPoints,
          coins: state.coins,
          ownedTitles: state.ownedTitles,
          equippedTitle: state.equippedTitle,
          completedChallenges: state.completedChallenges,
        };
      }
    },
    
    equipTitle: (state, action) => {
      const titleName = action.payload;
      
      if (state.ownedTitles.includes(titleName)) {
        state.equippedTitle = titleName;
        
        if (state.currentUserId) {
          state.userData[state.currentUserId].equippedTitle = titleName;
        }
      }
    },
    
    addPoints: (state, action) => {
      state.rankingPoints += action.payload;
      state.coins += action.payload;
      
      if (state.currentUserId) {
        state.userData[state.currentUserId].rankingPoints = state.rankingPoints;
        state.userData[state.currentUserId].coins = state.coins;
      }
    },
    
    completeChallenge: (state, action) => {
      const { day, points } = action.payload;
      
      if (state.completedChallenges.includes(day)) return;
      
      state.rankingPoints += points;
      state.coins += points;
      state.completedChallenges.push(day);
      
      if (state.currentUserId) {
        state.userData[state.currentUserId] = {
          rankingPoints: state.rankingPoints,
          coins: state.coins,
          ownedTitles: state.ownedTitles,
          equippedTitle: state.equippedTitle,
          completedChallenges: state.completedChallenges,
        };
      }
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