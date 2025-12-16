import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000';

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

export const completeChallengeAPI = createAsyncThunk(
  'shop/completeChallengeAPI',
  async ({ day, points }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/ranking/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ day, points }),
      });
      if (!response.ok) throw new Error('Erro ao completar desafio');
      const data = await response.json();
      return { day, points, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChallengesList = createAsyncThunk(
  'ranking/fetchChallengesList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/challenges`);
      if (!response.ok) throw new Error('Erro ao buscar desafios');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveChallengeAPI = createAsyncThunk(
  'ranking/saveChallengeAPI',
  async (challengeData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/ranking/manage/challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(challengeData),
      });

      if (!response.ok) throw new Error('Erro ao salvar desafio');
      const data = await response.json();
      return data.challenge; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChallengeAPI = createAsyncThunk(
  'ranking/deleteChallengeAPI',
  async (day, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/ranking/manage/challenge/${day}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erro ao excluir desafio');
      return day;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);