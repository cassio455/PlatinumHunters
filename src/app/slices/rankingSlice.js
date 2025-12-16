import { createSlice } from '@reduxjs/toolkit';
import * as rankingThunks from '../thunks/rankingThunks'; 

const initialState = {
  list: [], 
  challenges: [],
  loading: false,
  error: null,
};

const rankingSlice = createSlice({
  name: 'ranking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(rankingThunks.fetchRankingList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(rankingThunks.fetchRankingList.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(rankingThunks.fetchRankingList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(rankingThunks.fetchChallengesList.fulfilled, (state, action) => {
        state.challenges = action.payload;
    });

    builder.addCase(rankingThunks.saveChallengeAPI.fulfilled, (state, action) => {
        const saved = action.payload;
        const index = state.challenges.findIndex(c => c.day === saved.day);
        
        if (index !== -1) {
            state.challenges[index] = saved;
        } else {
            state.challenges.push(saved);
        }
    });

    builder.addCase(rankingThunks.deleteChallengeAPI.fulfilled, (state, action) => {
        const dayToDelete = action.payload;
        state.challenges = state.challenges.filter(c => c.day !== dayToDelete);
    });
  },
});

export default rankingSlice.reducer;