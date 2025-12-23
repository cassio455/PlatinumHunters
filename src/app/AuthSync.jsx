import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from './slices/authSlice';
import { clearTrophies, fetchUserProgress } from './slices/trophySlice';
import { fetchChallengesList, fetchRankingList } from './thunks/rankingThunks';
import { useNavigate } from 'react-router-dom';

const AuthSync = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const userId = user?.id || user?._id;

  // Restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(loginSuccess({ token, user: parsedUser }));
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
      }
    }
  }, [dispatch]);

  // Listen for auth logout events (token expiration)
  useEffect(() => {
    const handleAuthLogout = () => {
      dispatch(logout());
      navigate('/user/login', { replace: true });
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [dispatch, navigate]);

  // Sync with localStorage changes (logout if token is removed)
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (isAuthenticated && !token) {
        dispatch(logout());
      }
    };

    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchUserProgress());
      dispatch(fetchChallengesList());
      dispatch(fetchRankingList());

    } else {
      dispatch(clearTrophies());
    }
  }, [isAuthenticated, userId, dispatch]);

  return null;
};

export default AuthSync;