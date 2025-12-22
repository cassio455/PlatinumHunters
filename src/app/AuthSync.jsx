import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearTrophies, fetchUserProgress } from './slices/trophySlice';

import { fetchChallengesList, fetchRankingList } from './thunks/rankingThunks';

const AuthSync = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const userId = user?.id || user?._id;

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