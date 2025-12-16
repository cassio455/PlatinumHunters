import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Importamos a ação de limpar e a ação de buscar do backend
import { clearTrophies, fetchUserProgress } from './slices/trophySlice';

const AuthSync = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Usa o ID do usuário real logado
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (isAuthenticated && userId) {
      // SUCESSO: Se logou, chama o Backend para buscar os troféus desse usuário
      dispatch(fetchUserProgress());
    } else {
      // LOGOUT: Se saiu, limpa a memória do Redux
      dispatch(clearTrophies());
    }
  }, [isAuthenticated, userId, dispatch]);

  return null;
};

export default AuthSync;