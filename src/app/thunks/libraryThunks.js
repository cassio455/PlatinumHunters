import {
  setLibrary,
  setLoading,
  setError,
  updateLibraryGame as updateLibraryGameAction,
  addToLibrary as addToLibraryAction,
  removeFromLibrary as removeFromLibraryAction,
  setPagination,
  setLastFetched,
} from '../slices/librarySlice';
import { libraryApi, gamesApi, customGamesApi } from '../../services/api';

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Check if library cache is still valid
 */
const isCacheValid = (lastFetched) => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < CACHE_DURATION;
};

/**
 * Normalize library item from backend to frontend format
 */
const normalizeLibraryItem = (item, gameData = null) => {
  return {
    id: item._id || item.id,
    userId: item.userId,
    gameId: item.gameId,
    name: gameData?.nome || 'Jogo não encontrado',
    img: gameData?.backgroundimage || '',
    status: item.status,
    progresso: item.progress != null ? `${item.progress}%` : null,
    progress: item.progress,
    playTime: gameData?.playtime || 0,
    rating: item.rating || 0,
    dateAdded: item.createdAt || item.dateAdded,
    platforms: item.platforms || [],
    genres: gameData?.genres || [],
    platinum: item.platinum || false,
    hoursPlayed: item.hoursPlayed || 0,
    updatedAt: item.updatedAt,
  };
};

/**
 * Fetch user library with optional filters and pagination
 * Implements intelligent caching to avoid unnecessary API calls
 */
export const fetchUserLibrary = (options = {}, forceRefresh = false) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { lastFetched, library, cachedUserId, cachedFilters } = state.library;
    const currentUserId = state.auth?.user?.id || state.auth?.user?._id;

    // SEGURANÇA: Se o usuário mudou, limpar cache completamente
    if (cachedUserId && currentUserId && cachedUserId !== currentUserId) {
      console.warn('[SECURITY] User changed, clearing library cache');
      dispatch(setLibrary([]));
      dispatch(setLastFetched({ timestamp: null, userId: null, filters: null }));
    }

    // Verificar se os filtros mudaram
    const filtersChanged = JSON.stringify(cachedFilters) !== JSON.stringify(options);
    
    // Se há filtros ou os filtros mudaram, não usar cache
    const hasFilters = options.status || options.name || options.page || options.limit;

    // Check cache validity - skip cache if:
    // - forceRefresh is true
    // - filters are present or changed
    // - user changed
    // - cache is invalid or empty
    if (!forceRefresh && !filtersChanged && !hasFilters && isCacheValid(lastFetched) && library.length > 0 && cachedUserId === currentUserId) {
      return;
    }

    dispatch(setLoading(true));

    // Fetch library from backend
    const response = await libraryApi.getLibrary(options, getState);
    
    // Extract data from response
    const libraryItems = response.data?.items || [];
    const pagination = response.data?.pagination || null;

    // Enrich library items with game data
    const libraryWithGames = await Promise.all(
      libraryItems.map(async (item) => {
        try {
          // Tentar buscar como jogo normal primeiro
          const gameData = await gamesApi.getGameById(item.gameId, getState);
          return normalizeLibraryItem(item, gameData);
        } catch (err) {
          // Se falhar, pode ser um custom game
          try {
            const customGameData = await customGamesApi.getCustomGameById(item.gameId, getState);
            return normalizeLibraryItem(item, customGameData);
          } catch (customErr) {
            console.warn(`Failed to fetch game ${item.gameId}:`, err.message, customErr?.message || customErr);
            return normalizeLibraryItem(item, null);
          }
        }
      })
    );

    dispatch(setLibrary(libraryWithGames));
    if (pagination) {
      dispatch(setPagination(pagination));
    }
    dispatch(setLastFetched({ 
      timestamp: Date.now(), 
      userId: currentUserId,
      filters: options
    }));
  } catch (error) {
    console.error('Error fetching library:', error);
    dispatch(setError(error.message || 'Erro ao buscar biblioteca'));
    
    // Handle authentication errors
    if (error.status === 401 || error.status === 403) {
      // Token expired or invalid - user should be redirected to login
      // This will be handled by the component
    }
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Add game to library
 * Uses optimistic update for better UX
 */
export const addGameToLibrary = (gameId, status = 'Jogando', gameData = null) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));

    // Optimistic update
    if (gameData) {
      const optimisticItem = normalizeLibraryItem(
        {
          id: `temp-${Date.now()}`,
          userId: getState().auth?.user?.id,
          gameId,
          status,
          progress: 0,
          platinum: false,
          hoursPlayed: 0,
          createdAt: new Date().toISOString(),
        },
        gameData
      );
      dispatch(addToLibraryAction(optimisticItem));
    }

    // Call backend API
    const response = await libraryApi.addToLibrary(gameId, status, getState);
    
    // Fetch game details if not provided
    let enrichedGameData = gameData;
    if (!enrichedGameData) {
      try {
        enrichedGameData = await gamesApi.getGameById(gameId, getState);
      } catch (err) {
        console.warn(`Failed to fetch game details for ${gameId}:`, err.message);
      }
    }

    // Update with actual data from backend
    // API retorna: { message: '...', data: {...} }
    const libraryData = response.data || response;
    const normalizedItem = normalizeLibraryItem(libraryData, enrichedGameData);
    dispatch(updateLibraryGameAction(normalizedItem));

    return { success: true, data: normalizedItem };
  } catch (error) {
    console.error('Error adding game to library:', error);
    dispatch(setError(error.message || 'Erro ao adicionar jogo à biblioteca'));
    
    // Revert optimistic update on error
    if (gameData) {
      await dispatch(fetchUserLibrary({}, true));
    }
    
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Update game progress, status, or other fields in library
 */
export const updateLibraryGame = (gameId, updates) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));

    // Optimistic update
    const state = getState();
    const existingItem = state.library.library.find(item => item.gameId === gameId);
    if (existingItem) {
      dispatch(updateLibraryGameAction({
        ...existingItem,
        ...updates,
        progresso: updates.progress != null ? `${updates.progress}%` : existingItem.progresso,
      }));
    }

    // Call backend API
    const response = await libraryApi.updateGame(gameId, updates, getState);
    
    // Update with actual data from backend
    if (existingItem) {
      // API retorna: { message: '...', data: {...} }
      const updatedData = response.data || response;
      const normalizedItem = normalizeLibraryItem(updatedData, {
        nome: existingItem.name,
        backgroundimage: existingItem.img,
        playtime: existingItem.playTime,
        genres: existingItem.genres,
      });
      dispatch(updateLibraryGameAction(normalizedItem));
    }

    return { success: true, data: response.data || response };
  } catch (error) {
    console.error('Error updating library game:', error);
    dispatch(setError(error.message || 'Erro ao atualizar jogo'));
    
    // Revert optimistic update on error
    await dispatch(fetchUserLibrary({}, true));
    
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Remove game from library
 * Uses optimistic update for better UX
 */
export const removeGameFromLibrary = (gameId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));

    // Find the library item
    const state = getState();
    const libraryItem = state.library.library.find(item => item.gameId === gameId);
    
    if (!libraryItem) {
      throw new Error('Game not found in library');
    }

    // Optimistic update
    dispatch(removeFromLibraryAction(libraryItem.id));

    // Call backend API
    await libraryApi.removeFromLibrary(gameId, getState);

    return { success: true };
  } catch (error) {
    console.error('Error removing game from library:', error);
    dispatch(setError(error.message || 'Erro ao remover jogo da biblioteca'));
    
    // Revert optimistic update on error
    await dispatch(fetchUserLibrary({}, true));
    
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};