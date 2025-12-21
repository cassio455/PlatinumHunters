import { createSlice } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import { 
    fetchUserProgress, 
    trackGameThunk, 
    toggleTrophyThunk,
    toggleAllTrophiesThunk // <--- NOVO IMPORT
} from '../thunks/trophyThunks';
import { TROPHIES } from '../../data/trophiesData';

const initialState = {
  completedTrophies: {}, 
  trackedGameIds: [],   
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
        state.status = 'idle';
    }
  },
  
  extraReducers: (builder) => {
    builder
      // --- LOGOUT ---
      .addCase(logout, (state) => {
        state.completedTrophies = {}; 
        state.trackedGameIds = []; 
        state.status = 'idle';
      })

      // --- FETCH PROGRESS ---
      .addCase(fetchUserProgress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const backendData = action.payload; 

        const newCompletedTrophies = {};
        const newTrackedIds = [];

        Object.keys(backendData).forEach(gameId => {
            const gameData = backendData[gameId];

            if (gameData.isTracked) {
                newTrackedIds.push(gameId);
            }

            if (gameData.completedTrophies && gameData.completedTrophies.length > 0) {
                newCompletedTrophies[gameId] = {};
                const gameTrophyList = TROPHIES[gameId] || [];

                gameData.completedTrophies.forEach(trophyName => {
                    const originalIndex = gameTrophyList.findIndex(t => t.name === trophyName);
                    newCompletedTrophies[gameId][trophyName] = {
                        isCompleted: true,
                        originalIndex: originalIndex !== -1 ? originalIndex : 0
                    };
                });
            }
        });

        state.completedTrophies = newCompletedTrophies;
        state.trackedGameIds = newTrackedIds;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- TRACK GAME ---
      .addCase(trackGameThunk.fulfilled, (state, action) => {
        const { gameId, isTracked } = action.payload;
        if (isTracked) {
            if (!state.trackedGameIds.includes(gameId)) state.trackedGameIds.push(gameId);
        } else {
            state.trackedGameIds = state.trackedGameIds.filter(id => id !== gameId);
        }
      })

      // --- TOGGLE TROPHY (Individual) ---
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

      // --- TOGGLE ALL (NOVO: Marcar/Desmarcar Tudo) ---
      .addCase(toggleAllTrophiesThunk.fulfilled, (state, action) => {
        const { gameId, completedTrophies } = action.payload;
        
        // Reinicia o objeto desse jogo
        state.completedTrophies[gameId] = {};

        // Se a lista vier vazia (desmarcou tudo), o objeto fica vazio e pronto.
        // Se vier cheia, preenchemos tudo como true.
        if (completedTrophies && completedTrophies.length > 0) {
            const gameTrophyList = TROPHIES[gameId] || [];

            completedTrophies.forEach(trophyName => {
                const originalIndex = gameTrophyList.findIndex(t => t.name === trophyName);
                state.completedTrophies[gameId][trophyName] = {
                    isCompleted: true,
                    originalIndex: originalIndex !== -1 ? originalIndex : 0
                };
            });
        }
      });
  },
});

export const { clearTrophies } = trophySlice.actions;
export { fetchUserProgress, trackGameThunk, toggleTrophyThunk, toggleAllTrophiesThunk }; 
export default trophySlice.reducer;