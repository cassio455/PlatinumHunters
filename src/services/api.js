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
 * Handle authentication errors globally
 * @param {number} status - HTTP status code
 */
const handleAuthError = (status) => {
  if (status === 401 || status === 403) {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/user/login';
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
  addToLibrary: async (gameId, status = 'playing', getState) => {
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
    return response.data || response;
  },

  getPlatforms: async (getState = null) => {
    const response = await apiRequest('/platforms', { method: 'GET' }, getState);
    return response.data || response;
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
};

export default {
  apiRequest,
  libraryApi,
  gamesApi,
  authApi,
  API_BASE_URL,
};
