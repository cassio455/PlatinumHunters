import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from './slices/authSlice';
import { clearTrophies, fetchUserProgress } from './slices/trophySlice';

const AuthSync = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

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
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Busca os dados do usuário quando estiver autenticado
      dispatch(fetchUserProgress());
    } else {
      // Limpa os dados quando deslogar
      dispatch(clearTrophies());
    }
  }, [isAuthenticated, user?.id, dispatch]);

  return null;
};

export default AuthSync;