import { authStart, loginSuccess, signupSuccess, loginFailure } from '../slices/authSlice';

const API_URL = 'http://localhost:3000';

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(authStart());
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao fazer login');
    }

    const userData = {
      id: result.data.id,
      username: result.data.username,
      email: result.data.email,
      profileImageUrl: result.data.profileImageUrl,
      createdAt: result.data.createdAt,
    };

    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(userData));

    dispatch(loginSuccess({ 
      token: result.token, 
      user: userData 
    }));

    return { success: true, user: userData };
  } catch (error) {
    dispatch(loginFailure(error.message));
    return { success: false, error: error.message };
  }
};

export const signupUser = (userData) => async (dispatch) => {
  try {
    dispatch(authStart());
    
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao criar conta');
    }

    const newUser = {
      id: result.data.id,
      username: result.data.username,
      email: result.data.email,
      profileImageUrl: result.data.profileImageUrl,
      createdAt: result.data.createdAt,
    };

    localStorage.setItem('user', JSON.stringify(newUser));

    dispatch(signupSuccess({ 
      user: newUser,
      token: null
    }));

    return { success: true, user: newUser };
  } catch (error) {
    dispatch(loginFailure(error.message));
    return { success: false, error: error.message };
  }
};