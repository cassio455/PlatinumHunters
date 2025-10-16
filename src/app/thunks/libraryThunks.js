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

        const gameName = gameData.nome;
        const gameImg = gameData.backgroundimage;
        const gamePlaytime = gameData.playtime;

        return {
          id: item.id,
          userId: item.userId,
          gameId: item.gameId,
          name: gameName,
          img: gameImg,
          status: item.status,
          progresso: item.progress != null ? `${item.progress}%` : null,
          progress: item.progress,
          playTime: gamePlaytime,
          rating: item.rating,
          dateAdded: item.dateAdded,
          platforms: item.platforms,
          genres: gameData.genres,
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
