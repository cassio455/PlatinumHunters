import { createSlice } from '@reduxjs/toolkit';
import { fetchGuides, createGuide, fetchGuideDetails } from '../thunks/guidesThunks';

const initialState = {
  guides: [],
  guideDetails: null,
  loading: false,
  error: null,
};

const guidesSlice = createSlice({
  name: 'guides',
  initialState,
  reducers: {
    // Se quiser adicionar reducers síncronos, coloque aqui
    clearGuideDetails(state) {
      state.guideDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Buscar todos os guias
      .addCase(fetchGuides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuides.fulfilled, (state, action) => {
        state.loading = false;
        state.guides = action.payload;
      })
      .addCase(fetchGuides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    // Criar guia
      .addCase(createGuide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGuide.fulfilled, (state, action) => {
        state.loading = false;
        state.guides = action.payload;
      })
      .addCase(createGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    // Buscar detalhes de um guia
      .addCase(fetchGuideDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.guideDetails = null;
      })
      .addCase(fetchGuideDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.guideDetails = action.payload;
      })
      .addCase(fetchGuideDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.guideDetails = null;
      });
  }
});

export const { clearGuideDetails } = guidesSlice.actions;
export default guidesSlice.reducer;