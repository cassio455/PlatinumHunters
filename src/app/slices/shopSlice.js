import { createSlice } from '@reduxjs/toolkit';
import { loginSuccess, logout } from './authSlice'; // Importa ações de Auth
import { buyTitleAPI, equipTitleAPI } from '../thunks/shopThunks'; // Importa os novos Thunks
import { completeChallengeAPI } from '../thunks/rankingThunks';

const initialState = {
  coins: 0,
  ownedTitles: [],
  equippedTitle: null,
  loading: false,
  error: null
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    // Removemos os reducers locais antigos (buyTitle, equipTitle)
    // pois agora usaremos os Thunks assíncronos
  },
  extraReducers: (builder) => {
    // 1. SINCRONIZA COM O LOGIN
    // Quando o usuário loga, o Shop pega os dados dele imediatamente
    builder.addCase(loginSuccess, (state, action) => {
      const user = action.payload.user;
      state.coins = user.coins || 0;
      state.ownedTitles = user.ownedTitles || [];
      state.equippedTitle = user.equippedTitle || null;
    });

    // 2. SINCRONIZA COM DESAFIOS
    builder.addCase(completeChallengeAPI.fulfilled, (state, action) => {
        if(action.payload.newCoins !== undefined) {
            state.coins = action.payload.newCoins;
        }
    });

    // 3. COMPRA DE TÍTULO (API)
    builder.addCase(buyTitleAPI.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(buyTitleAPI.fulfilled, (state, action) => {
      state.loading = false;
      // Atualiza com os dados reais vindos do banco
      state.coins = action.payload.coins;
      state.ownedTitles = action.payload.ownedTitles;
    })
    .addCase(buyTitleAPI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // 4. EQUIPAR TÍTULO (API)
    builder.addCase(equipTitleAPI.fulfilled, (state, action) => {
      state.equippedTitle = action.payload.title;
    });

    // 5. LOGOUT (Limpa tudo)
    builder.addCase(logout, (state) => {
      state.coins = 0;
      state.ownedTitles = [];
      state.equippedTitle = null;
    });
  },
});

export default shopSlice.reducer;