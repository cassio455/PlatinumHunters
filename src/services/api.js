const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthToken = (getState) => {
  if (getState) {
    const state = getState();
    const token = state.auth?.token;
    if (token) return token;
  }
  return localStorage.getItem('token') || null;
};

const createHeaders = (getState, additionalHeaders = {}) => {
  const token = getAuthToken(getState);
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Get authentication headers for direct fetch calls
 * Useful for thunks that don't use apiRequest
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Handle authentication errors globally
 * @param {number} status - HTTP status code
 */
const handleAuthError = (status) => {
  if (status === 401 || status === 403) {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }
};

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  
  if (!response.ok) {
    let errorMessage;
    try {
      if (contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || response.statusText;
      } else {
        errorMessage = await response.text();
      }
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    
    // Handle authentication errors globally
    handleAuthError(response.status);
    
    throw error;
  }

  if (contentType.includes('application/json')) {
    return await response.json();
  }

  return null;
};

export const apiRequest = async (endpoint, options = {}, getState = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: getState ? createHeaders(getState) : { 'Content-Type': 'application/json' },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return await parseResponse(response);
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
};

/**
 * Library API Service
 */
export const libraryApi = {
  /**
   * Get user's library with optional filters and pagination
   * GET /library
   */
  getLibrary: async ({ status, page, limit } = {}, getState) => {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    
    const query = queryParams.toString();
    const endpoint = query ? `/library?${query}` : '/library';
    
    return apiRequest(endpoint, { method: 'GET' }, getState);
  },

  /**
   * Add game to library
   * POST /library
   */
  addToLibrary: async (gameId, status = 'Jogando', getState) => {
    return apiRequest(
      '/library',
      {
        method: 'POST',
        body: JSON.stringify({ gameId, status }),
      },
      getState
    );
  },

  /**
   * Update game progress and status in library
   * PATCH /library/{gameId}
   */
  updateGame: async (gameId, updates, getState) => {
    return apiRequest(
      `/library/${gameId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      },
      getState
    );
  },

  /**
   * Remove game from library
   * DELETE /library/{gameId}
   */
  removeFromLibrary: async (gameId, getState) => {
    return apiRequest(
      `/library/${gameId}`,
      { method: 'DELETE' },
      getState
    );
  },
};

/**
 * Custom Games API Service
 */
export const customGamesApi = {
  /**
   * Get custom game by ID
   * GET /library/custom-games (filtered by gameId client-side)
   */
  getCustomGameById: async (gameId, getState = null) => {
    const response = await apiRequest('/library/custom-games', { method: 'GET' }, getState);
    // API retorna: { message: '...', data: { items: [...] } }
    const customGames = response.data?.items || [];
    const customGame = customGames.find(game => game._id === gameId);
    
    if (!customGame) {
      throw new Error('Custom game not found');
    }
    
    return customGame;
  },
};

export const gamesApi = {
  /**
   * Get all games with optional pagination
   * GET /games
   */
  getAllGames: async ({ page, limit } = {}, getState = null) => {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    
    const query = queryParams.toString();
    const endpoint = query ? `/games?${query}` : '/games';
    
    const response = await apiRequest(endpoint, { method: 'GET' }, getState);
    // API retorna: { message: '...', data: { items: [...], limit, page, total, totalPages } }
    return response.data?.items || [];
  },

  /**
   * Get game by ID
   * GET /games/{id}
   */
  getGameById: async (gameId, getState = null) => {
    const response = await apiRequest(`/games/${gameId}`, { method: 'GET' }, getState);
    // API retorna: { message: '...', data: {...} }
    return response.data || response;
  },

  /**
   * Get all genres
   * GET /genres
   */
  getGenres: async (getState = null) => {
    const response = await apiRequest('/genres', { method: 'GET' }, getState);
    // API retorna: { message: '...', data: { items: [...], pagination: {...} } }
    return response.data?.items || [];
  },

  getPlatforms: async (getState = null) => {
    const response = await apiRequest('/platforms', { method: 'GET' }, getState);
    // API retorna: { message: '...', data: { items: [...], pagination: {...} } }
    return response.data?.items || [];
  },
};

/**
 * Auth API Service
 */
export const authApi = {
  /**
   * Login user
   * POST /users/login
   */
  login: async (credentials) => {
    return apiRequest(
      '/users/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      null
    );
  },

  /**
   * Register new user
   * POST /users/register
   */
  register: async (userData) => {
    return apiRequest(
      '/users/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      null
    );
  },

  /**
   * Get authenticated user profile with statistics
   * GET /users/me
   */
  getUserProfile: async (getState) => {
    return apiRequest(
      '/users/me',
      { method: 'GET' },
      getState
    );
  },
};

/**
 * Trophy API Service
 * Adicionada para gerenciar as rotas de troféus sem modificar o resto
 */
export const trophyApi = {
  /**
   * Get trophies for a specific game
   * GET /trophies/game/:gameId
   */
  getTrophiesByGame: async (gameId, getState = null) => {
    return apiRequest(`/trophies/game/${gameId}`, { method: 'GET' }, getState);
  },

  /**
   * Get user's trophy progress
   * GET /trophies/my-progress
   */
  getMyProgress: async (getState = null) => {
    return apiRequest('/trophies/my-progress', { method: 'GET' }, getState);
  },

  /**
   * List available games specifically for trophy tracking
   * GET /trophies/available-games
   */
  getAvailableGames: async (getState = null) => {
    return apiRequest('/trophies/available-games', { method: 'GET' }, getState);
  },

  /**
   * Track or untrack a game
   * POST /trophies/track
   */
  trackGame: async (data, getState = null) => {
    return apiRequest('/trophies/track', { method: 'POST', body: JSON.stringify(data) }, getState);
  },

  /**
   * Toggle trophy status
   * POST /trophies/toggle
   */
  toggleTrophy: async (data, getState = null) => {
    return apiRequest('/trophies/toggle', { method: 'POST', body: JSON.stringify(data) }, getState);
  },

  /**
   * Toggle All Trophies status
   * POST /trophies/toggle-all
   */
  toggleAllTrophies: async (data, getState = null) => {
    return apiRequest('/trophies/toggle-all', { method: 'POST', body: JSON.stringify(data) }, getState);
  },

  // Admin Routes (CRUD)
  createTrophy: async (data, getState = null) => {
    return apiRequest('/trophies/create', { method: 'POST', body: JSON.stringify(data) }, getState);
  },

  editTrophy: async (id, data, getState = null) => {
    return apiRequest(`/trophies/edit/${id}`, { method: 'PUT', body: JSON.stringify(data) }, getState);
  },

  deleteTrophy: async (id, getState = null) => {
    return apiRequest(`/trophies/delete/${id}`, { method: 'DELETE' }, getState);
  }
};

export default {
  apiRequest,
  libraryApi,
  gamesApi,
  authApi,
  trophyApi, // Adicionado ao export default
  API_BASE_URL,
  getAuthHeaders,
  customGamesApi,
};