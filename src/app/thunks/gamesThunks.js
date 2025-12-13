import {
  setGames,
  setLoading,
  setError,
} from '../slices/gamesSlice';

const API_URL = 'http://localhost:3000';

export const fetchGames = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await fetch(`${API_URL}/games`);

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || response.statusText || `HTTP ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      dispatch(setGames(data));
    } else {
      console.warn('Formato inesperado recebido da API de jogos:', data);
      dispatch(setGames([]));
    }

  } catch (error) {
    console.error('Erro ao buscar jogos locais:', error);
    dispatch(setError(error.message || 'Erro desconhecido ao carregar jogos.'));
  } finally {
    dispatch(setLoading(false));
  }
};