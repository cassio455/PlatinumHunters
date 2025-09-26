import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    name: '',
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.user.name = action.payload
    },
  },
})

export const { setName } = userSlice.actions

export default userSlice.reducer