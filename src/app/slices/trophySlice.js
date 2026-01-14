import { createSlice } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import { 
    fetchUserProgress, 
    trackGameThunk, 
    toggleTrophyThunk, 
    toggleAllTrophiesThunk,
    fetchGameTrophiesThunk, 
    createTrophyThunk,
    deleteTrophyThunk,
    editTrophyThunk,
    fetchAvailableGamesThunk
} from '../thunks/trophyThunks';

const initialState = {
  availableGames: [], 
  userProgress: [],   
  gameTrophiesList: [], 
  status: 'idle',       
  error: null,
};

export const trophySlice = createSlice({
  name: 'trophies',
  initialState,
  reducers: {
    clearTrophies: (state) => {
        state.availableGames = [];
        state.userProgress = [];
        state.gameTrophiesList = [];
        state.status = 'idle';
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.availableGames = [];
        state.userProgress = [];
        state.gameTrophiesList = [];
        state.status = 'idle';
      })

      .addCase(fetchAvailableGamesThunk.fulfilled, (state, action) => {
          state.availableGames = action.payload;
      })

      .addCase(fetchUserProgress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userProgress = action.payload;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(trackGameThunk.fulfilled, (state, action) => {
        const updatedProgress = action.payload;
        if (updatedProgress && updatedProgress.gameId) {
             const index = state.userProgress.findIndex(p => p.gameId === updatedProgress.gameId);
             if (index !== -1) {
                 // Mantém campos antigos (como total) e atualiza novos
                 state.userProgress[index] = { ...state.userProgress[index], ...updatedProgress };
             } else if (updatedProgress.isTracked) {
                 state.userProgress.push(updatedProgress);
             }
        }
      })

      .addCase(toggleTrophyThunk.fulfilled, (state, action) => {
         const { gameId, progress } = action.payload; 
         if (progress) {
             const index = state.userProgress.findIndex(p => p.gameId === gameId);
             if (index !== -1) {
                 // CRÍTICO: Mescla o progresso novo com o antigo para não perder o 'total'
                 state.userProgress[index] = { ...state.userProgress[index], ...progress };
                 // Garante que a lista de IDs completados está atualizada
                 state.userProgress[index].completedTrophies = progress.completedTrophies;
             } else {
                 state.userProgress.push(progress);
             }
         }
      })

      .addCase(toggleAllTrophiesThunk.fulfilled, (state, action) => {
        const { gameId, progress } = action.payload;
        if (progress) {
             const index = state.userProgress.findIndex(p => p.gameId === gameId);
             if (index !== -1) {
                 state.userProgress[index] = { ...state.userProgress[index], ...progress };
             } else {
                 state.userProgress.push(progress);
             }
        }
      })
      
      .addCase(fetchGameTrophiesThunk.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
            state.gameTrophiesList = action.payload;
        } else if (action.payload && action.payload.trophies) {
            state.gameTrophiesList = action.payload.trophies;
        } else {
            state.gameTrophiesList = [];
        }
      })

      .addCase(createTrophyThunk.fulfilled, (state, action) => {
        state.gameTrophiesList.push(action.payload);
      })
      .addCase(editTrophyThunk.fulfilled, (state, action) => {
          const index = state.gameTrophiesList.findIndex(t => t._id === action.payload._id);
          if (index !== -1) {
              state.gameTrophiesList[index] = action.payload;
          }
      })
      .addCase(deleteTrophyThunk.fulfilled, (state, action) => {
        const trophyId = action.payload;
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
    deleteTrophyThunk,
    editTrophyThunk,
    fetchAvailableGamesThunk
};

export default trophySlice.reducer;