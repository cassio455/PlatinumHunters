import {
    setGenres,
    setPlatforms,
    setLoading,
    setError,
} from '../slices/genrePlatformSlice';
import { gamesApi } from '../../services/api';

export const fetchGenres = () => async (dispatch, getState) =>{

    try{
        dispatch(setLoading(true));

        const items = await gamesApi.getGenres(getState);
        
        const genres = Array.isArray(items) ? items.map((genre) => ({
            id: genre._id,
            name: genre.name,
        })) : [];
        
        dispatch(setGenres(genres));
    } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
        dispatch(setError(error.message));
    } finally {

        dispatch(setLoading(false));
    }
}

export const fetchPlatforms = () => async (dispatch, getState) =>{
     try{
        dispatch(setLoading(true));
        
        const items = await gamesApi.getPlatforms(getState);
        
        const platforms = Array.isArray(items) ? items.map((platform) => ({
            id: platform._id,
            name: platform.name,
        })) : [];

        dispatch(setPlatforms(platforms));
    } catch(error) {
        console.error('Erro ao buscar plataformas:', error);
        dispatch(setError(error.message));
    }
    finally{
        dispatch(setLoading(false));
    }
}