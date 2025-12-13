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

        const data = await gamesApi.getGenres(getState);
        
        const genres = Array.isArray(data) ? data.map((genre) => ({
            id: genre.id,
            name: genre.name,
            count: genre.count,
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
        
        const data = await gamesApi.getPlatforms(getState);
        
        const platforms = Array.isArray(data) ? data.map((platform) => ({
            id: platform.id,
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