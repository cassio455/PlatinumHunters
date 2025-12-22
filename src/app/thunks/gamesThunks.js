import {
  setGames,
  setLoading,
  setError,
} from '../slices/gamesSlice';
import { gamesApi } from '../../services/api';

export const fetchGames = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));

    const games = await gamesApi.getAllGames({}, getState);
    
    if (Array.isArray(games)) {
      dispatch(setGames(games));
    } else {
      console.warn('Formato inesperado recebido da API de jogos:', games);
      dispatch(setGames([]));
    }

  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    dispatch(setError(error.message || 'Erro desconhecido ao carregar jogos.'));
  } finally {
    dispatch(setLoading(false));
  }
};