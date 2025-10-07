import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from './slices/authSlice';
import { setCurrentUser, clearCurrentUser } from '../app/slices/shopSlice';
import { MOCK_USER } from '../pages/User/userMock';
import { setCurrentTrophyUser, clearCurrentTrophyUser } from './slices/trophySlice';

const AuthSync = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = MOCK_USER.id || MOCK_USER.email;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === MOCK_USER.token) {
      dispatch(loginSuccess({ token, user: MOCK_USER }));
      dispatch(setCurrentUser(MOCK_USER.id || MOCK_USER.email));
    } else {
      dispatch(logout());
      dispatch(clearCurrentUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(setCurrentTrophyUser(userId));
    } else {
      dispatch(clearCurrentTrophyUser());
    }
  }, [isAuthenticated, userId, dispatch]);
  return null;
};

export default AuthSync;