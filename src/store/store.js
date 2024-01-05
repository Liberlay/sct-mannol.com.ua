import auth from './slices/authSlice'
import cart from './slices/cartSlice'
import favorites from './slices/favoritesSlice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    cart,
    auth,
    favorites,
  },
})
