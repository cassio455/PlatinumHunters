import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../app/slices/authSlice';
import { MOCK_USER } from '../pages/User/userMock';

//Synchronize authentication state with localStorage!!!! important
const AuthSync = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === MOCK_USER.token) {
      dispatch(loginSuccess({ token, user: MOCK_USER }));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return null;
};

export default AuthSync;
