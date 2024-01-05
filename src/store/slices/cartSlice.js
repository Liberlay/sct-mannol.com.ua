import { loadState } from 'utils/localStorage'
import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    isVisible: false,
    products: typeof window !== 'undefined' ? loadState('cartProducts') ?? [] : [],
  },
  reducers: {
    clickOpenCart(state) {
      state.isVisible = !state.isVisible
    },
    clickCloseCart(state) {
      state.isVisible = false
    },
    clearCart(state, action) {
      state.products = []

      localStorage.setItem('cartProducts', JSON.stringify(state.products))
    },
    addCartItem(state, action) {
      const existingProduct = state.products.find(
        (p) =>
          p.vendorCode === action.payload.vendorCode && p.optionKey === action.payload.optionKey,
      )
      if (existingProduct) {
        existingProduct.qty += 1
      } else {
        state.products.push(action.payload)
      }

      localStorage.setItem('cartProducts', JSON.stringify(state.products))
    },
    changeQuantity(state, action) {
      const existingProduct = state.products.find(
        (p) =>
          p.vendorCode === action.payload.vendorCode && p.optionKey === action.payload.optionKey,
      )

      if (existingProduct.qty + action.payload.value >= 1) {
        existingProduct.qty += action.payload.value
      }

      localStorage.setItem('cartProducts', JSON.stringify(state.products))
    },
    updateCartItem(state, action) {
      const existingProduct = state.products.find(
        (p) =>
          p.vendorCode === action.payload.vendorCode && p.optionKey === action.payload.optionKey,
      )
      existingProduct.details = action.payload.details

      localStorage.setItem('cartProducts', JSON.stringify(state.products))
    },
    removeProduct(state, action) {
      state.products = state.products.filter(
        (product) =>
          action.payload.vendorCode !== product.vendorCode ||
          action.payload.optionKey !== product.optionKey,
      )

      localStorage.setItem('cartProducts', JSON.stringify(state.products))
    },
  },
})

export const {
  clickOpenCart,
  clickCloseCart,
  clearCart,
  addCartItem,
  changeQuantity,
  updateCartItem,
  removeProduct,
} = cartSlice.actions

export default cartSlice.reducer
