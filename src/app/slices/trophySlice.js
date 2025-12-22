import { createSlice } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import { 
    fetchUserProgress, 
    trackGameThunk, 
    toggleTrophyThunk,
    toggleAllTrophiesThunk,
    fetchGameTrophiesThunk,
    createTrophyThunk,
    deleteTrophyThunk
} from '../thunks/trophyThunks';
import { TROPHIES } from '../../data/trophiesData';

const initialState = {
  gameTrophiesList: [],
  completedTrophies: {},
  trackedGameIds: [],   
  customTrophyCounts: {}, 
  
  status: 'idle',       
  error: null,
};

export const trophySlice = createSlice({
  name: 'trophies',
  initialState,
  reducers: {
    clearTrophies: (state) => {
        state.completedTrophies = {};
        state.trackedGameIds = [];
        state.gameTrophiesList = [];
        state.customTrophyCounts = {};
        state.status = 'idle';
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.completedTrophies = {}; 
        state.trackedGameIds = []; 
        state.gameTrophiesList = [];
        state.customTrophyCounts = {};
        state.status = 'idle';
      })

      .addCase(fetchUserProgress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const backendData = action.payload; 

        const newCompletedTrophies = {};
        const newTrackedIds = [];
        const newCustomCounts = {};

        Object.keys(backendData).forEach(gameId => {
            const gameData = backendData[gameId];

            if (gameData.isTracked) {
                newTrackedIds.push(gameId);
            }

            newCustomCounts[gameId] = gameData.customTrophyCount || 0;

            if (gameData.completedTrophies && gameData.completedTrophies.length > 0) {
                newCompletedTrophies[gameId] = {};
                const gameTrophyList = TROPHIES[gameId] || [];

                gameData.completedTrophies.forEach(trophyName => {
                    const originalIndex = gameTrophyList.findIndex(t => t.name === trophyName);
                    newCompletedTrophies[gameId][trophyName] = {
                        isCompleted: true,
                        originalIndex: originalIndex !== -1 ? originalIndex : 999
                    };
                });
            }
        });

        state.completedTrophies = newCompletedTrophies;
        state.trackedGameIds = newTrackedIds;
        state.customTrophyCounts = newCustomCounts;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(trackGameThunk.fulfilled, (state, action) => {
        const { gameId, isTracked } = action.payload;
        if (isTracked) {
            if (!state.trackedGameIds.includes(gameId)) state.trackedGameIds.push(gameId);
        } else {
            state.trackedGameIds = state.trackedGameIds.filter(id => id !== gameId);
        }
      })

      .addCase(toggleTrophyThunk.fulfilled, (state, action) => {
         const { gameId, trophyName, isCompleted, originalIndex } = action.payload;
         if (!state.completedTrophies[gameId]) {
             state.completedTrophies[gameId] = {};
         }
         state.completedTrophies[gameId][trophyName] = {
             isCompleted: isCompleted,
             originalIndex: originalIndex
         };
      })

      .addCase(toggleAllTrophiesThunk.fulfilled, (state, action) => {
        const { gameId, completedTrophies } = action.payload;
        state.completedTrophies[gameId] = {};
        if (completedTrophies && completedTrophies.length > 0) {
            const gameTrophyList = TROPHIES[gameId] || [];
            completedTrophies.forEach(trophyName => {
                const originalIndex = gameTrophyList.findIndex(t => t.name === trophyName);
                state.completedTrophies[gameId][trophyName] = {
                    isCompleted: true,
                    originalIndex: originalIndex !== -1 ? originalIndex : 999
                };
            });
        }
      })

      
      .addCase(fetchGameTrophiesThunk.fulfilled, (state, action) => {
        state.gameTrophiesList = action.payload; 
      })

      .addCase(createTrophyThunk.fulfilled, (state, action) => {
        state.gameTrophiesList.push(action.payload);
        const gameId = action.payload.gameId;
        state.customTrophyCounts[gameId] = (state.customTrophyCounts[gameId] || 0) + 1;
      })

      .addCase(deleteTrophyThunk.fulfilled, (state, action) => {
        const trophyId = action.payload;
        const trophy = state.gameTrophiesList.find(t => t._id === trophyId);
        if (trophy) {
            const gameId = trophy.gameId;
            state.customTrophyCounts[gameId] = Math.max(0, (state.customTrophyCounts[gameId] || 0) - 1);
        }
        state.gameTrophiesList = state.gameTrophiesList.filter(t => t._id !== trophyId);
      });
  },
});

export const { clearTrophies } = trophySlice.actions;
export { 
    fetchUserProgress, 
    trackGameThunk, 
    toggleTrophyThunk, 
    toggleAllTrophiesThunk,
    fetchGameTrophiesThunk, 
    createTrophyThunk,
    deleteTrophyThunk
}; 
export default trophySlice.reducer;