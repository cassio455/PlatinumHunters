import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000';

export const buyTitleAPI = createAsyncThunk(
  'shop/buyTitleAPI',
  async ({ name, cost }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/shop/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: name, cost }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro na compra');
      
      return data; // Retorna { coins, ownedTitles }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const equipTitleAPI = createAsyncThunk(
  'shop/equipTitleAPI',
  async (titleName, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/shop/equip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: titleName }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao equipar');

      return { title: titleName };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);