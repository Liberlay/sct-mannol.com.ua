import { loadState } from 'utils/localStorage'
import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: typeof window !== 'undefined' ? loadState('auth') : null,
  },

  reducers: {
    login(state, action) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
    },
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
