import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000'; 

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
    };
};

export const fetchUserProgress = createAsyncThunk(
    'trophies/fetchUserProgress',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/my-progress`, {
                method: 'GET',
                headers: getAuthHeader(),
            });

            if (!response.ok) throw new Error('Falha ao buscar troféus');
            return await response.json(); 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const trackGameThunk = createAsyncThunk(
    'trophies/trackGame',
    async ({ gameId, isTracked }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/track`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({ gameId, isTracked }),
            });

            if (!response.ok) throw new Error('Erro ao atualizar lista de jogos');
            return { gameId, isTracked }; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleTrophyThunk = createAsyncThunk(
    'trophies/toggleTrophy',
    async ({ gameId, trophyName, originalIndex }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/toggle`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({ gameId, trophyName }),
            });

            if (!response.ok) throw new Error('Erro ao atualizar troféu');

            const data = await response.json();
            return { 
                gameId, 
                trophyName, 
                isCompleted: data.isCompleted, 
                originalIndex 
            }; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleAllTrophiesThunk = createAsyncThunk(
    'trophies/toggleAll',
    async ({ gameId, allTrophies, markAll }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/toggle-all`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({ gameId, allTrophies, markAll }),
            });

            if (!response.ok) throw new Error('Erro ao atualizar todos os troféus');
            const data = await response.json();
            return { 
                gameId, 
                completedTrophies: data.completedTrophies, 
                markAll 
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchGameTrophiesThunk = createAsyncThunk(
    'trophies/fetchGameData',
    async (gameId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/list/${gameId}`, {
                 headers: getAuthHeader()
            });
            if (!response.ok) throw new Error('Erro ao carregar lista de troféus');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createTrophyThunk = createAsyncThunk(
    'trophies/create',
    async (trophyData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/create`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(trophyData),
            });
            if (!response.ok) throw new Error('Erro ao criar troféu');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteTrophyThunk = createAsyncThunk(
    'trophies/delete',
    async (trophyId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/delete/${trophyId}`, {
                method: 'DELETE',
                headers: getAuthHeader(),
            });
            if (!response.ok) throw new Error('Erro ao deletar troféu');
            return trophyId; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const editTrophyThunk = createAsyncThunk(
    'trophies/edit',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/edit/${id}`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Erro ao editar');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);