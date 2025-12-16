import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000';

export const buyTitleAPI = createAsyncThunk(
  'shop/buyTitleAPI',
  async ({ name, cost }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/shop/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: name, cost }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro na compra');
      return data;
    } catch (error) { return rejectWithValue(error.message); }
  }
);

export const equipTitleAPI = createAsyncThunk(
  'shop/equipTitleAPI',
  async (titleName, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/shop/equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: titleName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao equipar');
      return { title: titleName };
    } catch (error) { return rejectWithValue(error.message); }
  }
);

export const fetchTitlesList = createAsyncThunk(
    'shop/fetchTitlesList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/shop/titles`);
            if (!response.ok) throw new Error('Erro ao buscar títulos');
            return await response.json();
        } catch (error) { return rejectWithValue(error.message); }
    }
);

export const saveTitleAPI = createAsyncThunk(
    'shop/saveTitleAPI',
    async (titleData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await fetch(`${API_URL}/shop/manage/title`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(titleData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao salvar título');
            return data.title;
        } catch (error) { return rejectWithValue(error.message); }
    }
);

export const deleteTitleAPI = createAsyncThunk(
    'shop/deleteTitleAPI',
    async (id, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await fetch(`${API_URL}/shop/manage/title/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Erro ao excluir título');
            return id;
        } catch (error) { return rejectWithValue(error.message); }
    }
);