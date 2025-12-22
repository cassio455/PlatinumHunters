import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from './slices/authSlice';
import { clearTrophies, fetchUserProgress } from './slices/trophySlice';
import { fetchChallengesList, fetchRankingList } from './thunks/rankingThunks';

const AuthSync = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const userId = user?.id || user?._id;

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