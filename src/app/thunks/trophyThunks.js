import { createAsyncThunk } from '@reduxjs/toolkit';
import { trophyApi, gamesApi } from '../../services/api';

const createSlug = (text) => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/:/g, '')
      .replace(/'/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
};

export const fetchAvailableGamesThunk = createAsyncThunk(
    'trophies/fetchAvailableGames',
    async (_, { rejectWithValue, getState }) => {
        try {
            // AJUSTE: Reduzi o limite para 50 para evitar o erro 400 de validação do backend
            const games = await gamesApi.getAllGames({ limit: 220 }, getState); 
            
            return games.map(game => ({
                ...game,
                originalId: game.id || game._id,
                id: createSlug(game.nome || game.name) 
            }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserProgress = createAsyncThunk(
    'trophies/fetchUserProgress',
    async (_, { rejectWithValue, getState }) => {
        try {
            // Passando o getState para o trophyApi usar o token do Redux
            const response = await trophyApi.getMyProgress(getState);
            return response; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const trackGameThunk = createAsyncThunk(
    'trophies/trackGame',
    async ({ gameId, isTracked }, { rejectWithValue, getState }) => {
        try {
            const response = await trophyApi.trackGame({ gameId, isTracked }, getState);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchGameTrophiesThunk = createAsyncThunk(
    'trophies/fetchGameTrophies',
    async (gameId, { rejectWithValue, getState }) => {
        try {
            const response = await trophyApi.getTrophiesByGame(gameId, getState);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleTrophyThunk = createAsyncThunk(
    'trophies/toggleTrophy',
    async ({ gameId, trophyName }, { rejectWithValue, getState }) => {
        try {
            const response = await trophyApi.toggleTrophy({ gameId, trophyName }, getState);
            return { gameId, trophyName, progress: response };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleAllTrophiesThunk = createAsyncThunk(
    'trophies/toggleAll',
    async ({ gameId, allTrophies, markAll }, { rejectWithValue, getState }) => {
        try {
            const response = await trophyApi.toggleAllTrophies({ gameId, allTrophies, markAll }, getState);
            return { gameId, progress: response };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createTrophyThunk = createAsyncThunk(
    'trophies/create',
    async (trophyData, { rejectWithValue, getState }) => {
        try {
            const response = await trophyApi.createTrophy(trophyData, getState);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteTrophyThunk = createAsyncThunk(
    'trophies/delete',
    async (trophyId, { rejectWithValue, getState }) => {
        try {
            await trophyApi.deleteTrophy(trophyId, getState);
            return trophyId; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const editTrophyThunk = createAsyncThunk(
    'trophies/edit',
    async ({ id, data }, { rejectWithValue, getState }) => {
        try {
            const response = await trophyApi.editTrophy(id, data, getState);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);