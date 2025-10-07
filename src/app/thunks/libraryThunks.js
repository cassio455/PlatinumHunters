import {
  setLibrary,
  setLoading,
  setError,
} from '../slices/librarySlice';

const API_URL = 'http://localhost:3001';

export const fetchUserLibrary = (userId = 1) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const libraryResponse = await fetch(`${API_URL}/library?userId=${userId}`);
    const libraryData = await libraryResponse.json();
    
    const libraryWithGames = await Promise.all(
      libraryData.map(async (item) => {
        const gameResponse = await fetch(`${API_URL}/games/${item.gameId}`);
        const gameData = await gameResponse.json();
        
        return {
          id: item.id,
          gameId: item.gameId,
          name: gameData.name,
          img: gameData.image,
          status: item.status,
          progresso: `${item.progress}%`, // como porcentagem, depois corrigir
          progress: item.progress,
          playTime: item.playTime,
          rating: item.rating,
          notes: item.notes,
          achievements: item.achievements,
          favorite: item.favorite,
          startedAt: item.startedAt,
          completedAt: item.completedAt,
          lastPlayed: item.lastPlayed,
        };
      })
    );
    
    dispatch(setLibrary(libraryWithGames));
    dispatch(setLoading(false));
  } catch (error) {
    console.error('Erro ao buscar biblioteca:', error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};
