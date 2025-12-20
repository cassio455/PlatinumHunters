import { authStart, loginSuccess, signupSuccess, loginFailure } from '../slices/authSlice';
import { authApi } from '../../services/api';

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(authStart());
    
    const result = await authApi.login(credentials);

    const userData = {
      id: result.data.id,
      username: result.data.username,
      email: result.data.email,
      profileImageUrl: result.data.profileImageUrl,
      createdAt: result.data.createdAt,
    };

    localStorage.setItem('token', result.data.token);
    localStorage.setItem('user', JSON.stringify(userData));

    dispatch(loginSuccess({ 
      token: result.data.token, 
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
    
    const result = await authApi.register(userData);

    const newUser = {
      id: result.data.id,
      username: result.data.username,
      email: result.data.email,
      profileImageUrl: result.data.profileImageUrl,
      createdAt: result.data.createdAt,
    };

    localStorage.setItem('token', result.data.token);
    localStorage.setItem('user', JSON.stringify(newUser));

    dispatch(signupSuccess({ 
      user: newUser,
      token: result.data.token
    }));

    return { success: true, user: newUser };
  } catch (error) {
    dispatch(loginFailure(error.message));
    return { success: false, error: error.message };
  }
};

// Alias para compatibilidade com código da main
export const registerUser = signupUser;