import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Usamos as suas ações, que conectam com o Backend real
import { clearTrophies, fetchUserProgress } from './slices/trophySlice';

const AuthSync = () => {
  const dispatch = useDispatch();
  // Pegamos o usuário do sistema de Login dela (respeitando o código dela)
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Garante que pega o ID, não importa como venha do banco (_id ou id)
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (isAuthenticated && userId) {
      // Quando logar, buscamos os dados REAIS no banco (Sua parte)
      dispatch(fetchUserProgress());
    } else {
      // Quando deslogar, limpamos a tela
      dispatch(clearTrophies());
    }
  }, [isAuthenticated, userId, dispatch]);

  return null;
};

export default AuthSync;