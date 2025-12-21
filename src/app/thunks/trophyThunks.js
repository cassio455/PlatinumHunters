import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAuthHeaders } from '../../services/api';

const API_URL = 'http://localhost:3000';

// 1. Buscar progresso (GET /trophies/my-progress)
export const fetchUserProgress = createAsyncThunk(
    'trophies/fetchUserProgress',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/my-progress`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error('Falha ao buscar troféus');
            
            const data = await response.json();
            return data; // O Backend retorna { "gameId": { isTracked: true, completedTrophies: [] } }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 2. Adicionar/Remover jogo da lista (POST /trophies/track)
export const trackGameThunk = createAsyncThunk(
    'trophies/trackGame',
    async ({ gameId, isTracked }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/track`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ gameId, isTracked }),
            });

            if (!response.ok) throw new Error('Erro ao atualizar lista de jogos');
            
            return { gameId, isTracked }; // Retorna para atualizar o Redux
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 3. Marcar/Desmarcar Troféu (POST /trophies/toggle)
export const toggleTrophyThunk = createAsyncThunk(
    'trophies/toggleTrophy',
    async ({ gameId, trophyName, originalIndex }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/toggle`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ gameId, trophyName }),
            });

            if (!response.ok) throw new Error('Erro ao atualizar troféu');

            const data = await response.json();
            // data.isCompleted vem do backend. Repassamos o originalIndex para manter a UI correta
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

// 4. Marcar/Desmarcar TODOS os troféus (POST /trophies/toggle-all)
export const toggleAllTrophiesThunk = createAsyncThunk(
    'trophies/toggleAll',
    async ({ gameId, allTrophies, markAll }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trophies/toggle-all`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ gameId, allTrophies, markAll }),
            });

            if (!response.ok) throw new Error('Erro ao atualizar todos os troféus');

            const data = await response.json();
            
            // Retornamos os dados para o Redux atualizar a tela
            return { 
                gameId, 
                completedTrophies: data.completedTrophies, // Lista atualizada vinda do banco
                markAll 
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);