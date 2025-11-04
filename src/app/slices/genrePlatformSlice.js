import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    genres: [],
    platforms: [],
    loading: false,
    error: null,
}

const genrePlatformSlice = createSlice({
    name:'genresPlatforms',
    initialState,
    reducers:{
        setGenres: (state, action) => {
            state.genres = action.payload;
            state.loading = false;
            state.error = null;
        },
        setPlatforms: (state, action) => {
            state.platforms = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})
export const { setGenres, setPlatforms, setLoading, setError } = genrePlatformSlice.actions;
export default genrePlatformSlice.reducer;