import { createSlice } from '@reduxjs/toolkit';
// MUDANÇA: Apenas importa fetchRankingList (única que existe no Thunks que você mandou)
import { fetchRankingList } from '../thunks/rankingThunks'; 

const initialState = {
  list: [], // Lista do ranking de usuários
  challenges: [], // Deixamos vazio por enquanto
  loading: false,
  error: null,
};

const rankingSlice = createSlice({
  name: 'ranking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- USUÁRIOS RANKING ---
    builder.addCase(fetchRankingList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRankingList.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
      state.error = null;
    });
    builder.addCase(fetchRankingList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // MUDANÇA: Removemos todas as referências a fetchChallengesList, saveChallengeAPI, deleteChallengeAPI
    // pois elas quebram o código neste momento.
  },
});

export default rankingSlice.reducer;