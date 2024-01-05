import { loadState } from 'utils/localStorage'
import { createSlice } from '@reduxjs/toolkit'

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    products: typeof window !== 'undefined' ? loadState('favorites') ?? [] : [],
  },
  reducers: {
    addFavorite(state, action) {
      state.products.push(action.payload)

      localStorage.setItem('favorites', JSON.stringify(state.products))
    },
    removeFavorite(state, action) {
      state.products = state.products.filter((vendorCode) => action.payload != vendorCode)

      localStorage.setItem('favorites', JSON.stringify(state.products))
    },
  },
})

export const { addFavorite, removeFavorite } = favoritesSlice.actions

export default favoritesSlice.reducer
