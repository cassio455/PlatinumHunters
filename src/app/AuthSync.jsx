import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from './slices/authSlice';
import { MOCK_USER } from '../pages/User/userMock';
import { setCurrentTrophyUser, clearCurrentTrophyUser } from './slices/trophySlice';
import { setCurrentUser, clearCurrentUser } from './slices/shopSlice';

const AuthSync = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = MOCK_USER.id || MOCK_USER.email;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === MOCK_USER.token) {
      dispatch(loginSuccess({ token, user: MOCK_USER }));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(setCurrentUser(userId));
      dispatch(setCurrentTrophyUser(userId));
    } else {
      dispatch(clearCurrentUser());
      dispatch(clearCurrentTrophyUser());
    }
  }, [isAuthenticated, userId, dispatch]);

  return null;
};

export default AuthSync;