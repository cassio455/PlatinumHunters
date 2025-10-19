import { createSlice } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import { TROPHIES } from '../../data/trophiesData';

const initialState = {
  userData: {},
  completedTrophies: {},
  trackedGameIds: [],
  currentUserId: null,
};

const saveTrophiesToUserData = (state) => {
  if (state.currentUserId) {
    if (!state.userData[state.currentUserId]) {
      state.userData[state.currentUserId] = {};
    }
    state.userData[state.currentUserId].completedTrophies = state.completedTrophies;
    state.userData[state.currentUserId].trackedGameIds = state.trackedGameIds;
  }
};

export const trophySlice = createSlice({
  name: 'trophies',
  initialState,
  reducers: {
    setCurrentTrophyUser: (state, action) => {
      const userId = action.payload;
      state.currentUserId = userId;
      
      const userData = state.userData[userId];

      if (userData) {
        state.completedTrophies = userData.completedTrophies || {};
        state.trackedGameIds = userData.trackedGameIds || [];
      } else {
        state.completedTrophies = {};
        state.trackedGameIds = [];
        saveTrophiesToUserData(state);
      }
    },

    clearCurrentTrophyUser: (state) => {
      state.completedTrophies = {};
      state.trackedGameIds = [];
      state.currentUserId = null;
    },

    toggleTrophyCompletion: (state, action) => {
       if (!state.currentUserId) return;
       const { gameId, trophyName, originalIndex } = action.payload;
       if (!state.completedTrophies[gameId]) {
         state.completedTrophies[gameId] = {};
       }
       const currentState = state.completedTrophies[gameId][trophyName];
       state.completedTrophies[gameId][trophyName] = {
         isCompleted: !currentState?.isCompleted,
         originalIndex: originalIndex,
       };
       saveTrophiesToUserData(state);
    },

    addTrackedGame: (state, action) => {
      const gameId = action.payload;
      if (state.currentUserId && !state.trackedGameIds.includes(gameId)) {
        state.trackedGameIds.push(gameId);
        saveTrophiesToUserData(state);
      }
    },
    removeTrackedGame: (state, action) => {
      const gameIdToRemove = action.payload;
      if (state.currentUserId) {
        state.trackedGameIds = state.trackedGameIds.filter(id => id !== gameIdToRemove);
        saveTrophiesToUserData(state);
      }
    },

    markAllTrophies: (state, action) => {
      const gameId = action.payload;
      if (!state.currentUserId || !TROPHIES[gameId]) return;

      if (!state.completedTrophies[gameId]) {
        state.completedTrophies[gameId] = {};
      }

      TROPHIES[gameId].forEach((trophy, index) => {
        state.completedTrophies[gameId][trophy.name] = {
          isCompleted: true,
          originalIndex: index,
        };
      });
      
      saveTrophiesToUserData(state);
    },

    unmarkAllTrophies: (state, action) => {
      const gameId = action.payload;
      if (!state.currentUserId || !TROPHIES[gameId]) return;

      if (!state.completedTrophies[gameId]) {
        state.completedTrophies[gameId] = {};
      }

      TROPHIES[gameId].forEach((trophy, index) => {
        state.completedTrophies[gameId][trophy.name] = {
          isCompleted: false,
          originalIndex: index,
        };
      });

      saveTrophiesToUserData(state);
    },
  },
  
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.completedTrophies = {}; 
      state.trackedGameIds = []; 
      state.currentUserId = null;
    });
  },
});

export const { 
  setCurrentTrophyUser, 
  clearCurrentTrophyUser, 
  toggleTrophyCompletion,
  addTrackedGame,
  removeTrackedGame,
  markAllTrophies,
  unmarkAllTrophies
} = trophySlice.actions;

export default trophySlice.reducer;