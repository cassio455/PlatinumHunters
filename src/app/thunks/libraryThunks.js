import {
  setLibrary,
  setLoading,
  setError,
  updateLibraryGame,
} from '../slices/librarySlice';

const API_URL = 'http://localhost:3001';

export const fetchUserLibrary = (userId = 1) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const parseMaybeJson = async (response) => {
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || response.statusText || `HTTP ${response.status}`);
      }
      if (contentType.includes('application/json')) {
        return await response.json();
      }
      return null;
    };

    const libraryResponse = await fetch(`${API_URL}/library?userId=${userId}`);
    const libraryData = (await parseMaybeJson(libraryResponse)) || [];
    
    const libraryWithGames = await Promise.all(
      libraryData.map(async (item) => {
        try {
            const gameUrl = `${API_URL}/games/${item.gameId}`;
            console.debug(`Buscando jogo em: ${gameUrl}`);
            const gameResponse = await fetch(gameUrl);
            console.debug(`Resposta jogo ${item.gameId}: status=${gameResponse.status}, content-type=${gameResponse.headers.get('content-type')}`);
            let gameData = await parseMaybeJson(gameResponse);

            if (!gameData) {
              console.debug(`Tentando fallback /games?id=${item.gameId}`);
              const altResp = await fetch(`${API_URL}/games?id=${item.gameId}`);
              console.debug(`Fallback resposta: status=${altResp.status}, content-type=${altResp.headers.get('content-type')}`);
              const altData = await parseMaybeJson(altResp);
              if (Array.isArray(altData) && altData.length > 0) gameData = altData[0];
            }

          const gameName = gameData?.nome || 'Jogo não encontrado';
          const gameImg = gameData?.backgroundimage || '';
          const gamePlaytime = gameData?.playtime || 0;

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
            genres: gameData?.genres || [],
          };
        } catch (err) {
          console.warn(`Falha ao buscar jogo ${item.gameId}:`, err.message || err);
          return {
            id: item.id,
            userId: item.userId,
            gameId: item.gameId,
            name: 'Jogo não encontrado',
            img: '',
            status: item.status,
            progresso: item.progress != null ? `${item.progress}%` : null,
            progress: item.progress,
            playTime: 0,
            rating: item.rating,
            dateAdded: item.dateAdded,
            platforms: item.platforms,
            genres: [],
          };
        }
      })
    );
    
    dispatch(setLibrary(libraryWithGames));
  } catch (error) {
    console.error('Erro ao buscar biblioteca:', error);
    dispatch(setError(error.message));
  }
  finally {
    dispatch(setLoading(false));
  }
};
// Com o Backend tem que remover essa função aqui!
export const updateGameProgress = (libraryid, progress) => async (dispatch) =>{
  try{
    dispatch(setLoading(true));
    const response = await fetch(`${API_URL}/library/${libraryid}`,
    {
      method: 'PATCH',
      headers:{
        'content-type': 'application/json',
      },
      body: JSON.stringify({progress})
    });
    if(!response.ok){
      const text = await response.text().catch(() => null);
      throw new Error(text || 'Erro ao atualizar progresso do jogo');
    }
    let updated = null;
    try {
      updated = await response.json();
    } catch (e) {
      updated = null;
    }

    const newProgress = (updated && typeof updated.progress !== 'undefined') ? updated.progress : progress;
    dispatch(updateLibraryGame({
      id: libraryid,
      progress: newProgress,
      progresso: newProgress != null ? `${newProgress}%` : null,
    }));
  }
  catch(err){
    console.error("erro ao atualizar progresso:", err);
    dispatch(setError(err.message || 'Erro ao atualizar progresso'));
  }
  finally{
    dispatch(setLoading(false));
  }
};