import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTrophyUser, clearCurrentTrophyUser } from './slices/trophySlice';

const AuthSync = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userId = user?.id;

  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(setCurrentTrophyUser(userId));
    } else {
      dispatch(clearCurrentTrophyUser());
    }
  }, [isAuthenticated, userId, dispatch]);

  return null;
};

export default AuthSync;