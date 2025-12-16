import {
  loginSuccess,
  loginFailure,
} from '../slices/authSlice';

const API_URL = 'http://localhost:3000';

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
          const jsonError = JSON.parse(errorText);
          throw new Error(jsonError.message || 'Erro ao fazer login');
      } catch (e) {
          throw new Error(errorText || 'Erro ao conectar ao servidor');
      }
    }

    const result = await response.json();
    const { token, ...userData } = result.data; 

    const userPayload = {
        token: token,
        user: userData 
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    dispatch(loginSuccess(userPayload));
    return true; 

  } catch (error) {
    console.error('Erro no login:', error);
    dispatch(loginFailure(error.message));
    return false;
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
    }
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("O servidor não retornou JSON.");
    }

    const data = await response.json();
    const userPayload = {
        token: data.data.token,
        user: data.data
    };

    localStorage.setItem('token', userPayload.token);
    localStorage.setItem('user', JSON.stringify(userPayload.user));

    dispatch(loginSuccess(userPayload));
    return true; 

  } catch (error) {
    console.error('Erro no registro:', error);
    dispatch(loginFailure(error.message));
    return false;
  }
};