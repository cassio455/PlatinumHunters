import { createAsyncThunk } from '@reduxjs/toolkit';



const API_URL = 'http://localhost:3000'; // Confirme se sua porta é 3000



// Ação para buscar a lista de ranking do banco

export const fetchRankingList = createAsyncThunk(

  'ranking/fetchList',

  async (_, { rejectWithValue }) => {

    try {

      const response = await fetch(`${API_URL}/ranking`);

      if (!response.ok) throw new Error('Erro ao buscar ranking');

      return await response.json();

    } catch (error) {

      return rejectWithValue(error.message);

    }

  }

);



// Ação para salvar o desafio no banco

export const completeChallengeAPI = createAsyncThunk(

  'shop/completeChallengeAPI', // Usando shop namespace já que seus reducers estão lá

  async ({ day, points }, { getState, rejectWithValue }) => {

    try {

      const { token } = getState().auth; // Pega o token do Redux

      

      const response = await fetch(`${API_URL}/ranking/complete`, {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

          'Authorization': `Bearer ${token}` // Envia o token para o requireAuth

        },

        body: JSON.stringify({ day, points }),

      });



      if (!response.ok) throw new Error('Erro ao completar desafio');

      

      const data = await response.json();

      return { day, points, ...data }; // Retorna os dados novos para atualizar a tela

    } catch (error) {

      return rejectWithValue(error.message);

    }

  }

);