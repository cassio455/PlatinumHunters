import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// Buscar todos os guias
export const fetchGuides = createAsyncThunk(
  'guides/fetchGuides',
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest('/guides', { method: 'GET' });
    } catch (error) {
      return rejectWithValue(error.message || 'Erro ao buscar guias');
    }
  }
);

// Criar um novo guia
export const createGuide = createAsyncThunk(
  'guides/createGuide',
  async (guideData, { rejectWithValue }) => {
    try {
      await apiRequest('/guides', {
        method: 'POST',
        body: JSON.stringify(guideData),
      });
      return await apiRequest('/guides', { method: 'GET' });
    } catch (error) {
      return rejectWithValue(error.message || 'Erro ao criar guia');
    }
  }
);

// Buscar detalhes de um guia
export const fetchGuideDetails = createAsyncThunk(
  'guides/fetchGuideDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await apiRequest(`/guides/${id}`, { method: 'GET' });
    } catch (error) {
      return rejectWithValue(error.message || 'Erro ao buscar detalhes do guia');
    }
  }
);

// Curtir/descurtir guia
export const likeGuide = createAsyncThunk(
  'guides/likeGuide',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await apiRequest(`/guides/${id}/like`, { method: 'POST' });
      dispatch(fetchGuideDetails(id));
    } catch (error) {
      return rejectWithValue(error.message || 'Erro ao curtir/descurtir guia');
    }
  }
);

// Adicionar comentário
export const addGuideComment = createAsyncThunk(
  'guides/addGuideComment',
  async ({ id, texto }, { rejectWithValue, dispatch }) => {
    try {
      await apiRequest(`/guides/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ texto }),
      });
      dispatch(fetchGuideDetails(id));
    } catch (error) {
      return rejectWithValue(error.message || 'Erro ao comentar');
    }
  }
);

// Adicionar resposta (reply) a um comentário
export const addGuideReply = createAsyncThunk(
  'guides/addGuideReply',
  async ({ id, commentId, texto }, { rejectWithValue, dispatch }) => {
    try {
      await apiRequest(`/guides/${id}/comments/${commentId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ texto }),
      });
      dispatch(fetchGuideDetails(id));
    } catch (error) {
      return rejectWithValue(error.message || 'Erro ao responder comentário');
    }
  }
);