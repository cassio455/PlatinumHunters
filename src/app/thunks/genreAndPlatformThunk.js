import {
    setGenres,
    setPlatforms,
    setLoading,
    setError,
} from '../slices/genrePlatformSlice';

const API_URL = 'http://localhost:3000';

export const fetchGenres = () => async (dispatch) =>{

    try{
        dispatch(setLoading(true));

        const response =  await fetch(`${API_URL}/genres`);
        const data = await response.json();

        const genres = data.map((genre) => ({
            id: genre.id,
            name: genre.name,
            count: genre.count,
        }));
        dispatch(setGenres(genres));
    } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
        dispatch(setError(error.message));
    } finally {

        dispatch(setLoading(false));
    }
}

export const fetchPlatforms = () => async (dispatch) =>{
     try{
        dispatch(setLoading(true));
        const response = await fetch(`${API_URL}/platforms`);
        const data = await response.json();

        const platforms = data.map((platform) => ({
            id: platform.id,
            name: platform.name,
        }));

        dispatch(setPlatforms(platforms));
    } catch(error) {
        console.error('Erro ao buscar plataformas:', error);
        dispatch(setError(error.message));
    }
    finally{
        dispatch(setLoading(false));
    }
}