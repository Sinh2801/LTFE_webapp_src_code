import { configureStore } from '@reduxjs/toolkit'
import { clearToken } from '../libs/tokenStorage'
import authReducer, { logout } from './slices/authSlice'
import cartReducer, { saveCart } from './slices/cartSlice'
import categoryReducer from './slices/categorySlice'
import libraryReducer from './slices/librarySlice'
import orderReducer from './slices/orderSlice'
import productReducer from './slices/productSlice'
import favoritesReducer, { saveFavorites } from './slices/favoritesSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        categories: categoryReducer,
        products: productReducer,
        orders: orderReducer,
        library: libraryReducer,
        favorites: favoritesReducer,
    },
})

let lastCartItems = store.getState().cart.items
let lastFavorites = store.getState().favorites.items
store.subscribe(() => {
    const items = store.getState().cart.items
    if (items !== lastCartItems) {
        lastCartItems = items
        saveCart(items)
    }
    const favorites = store.getState().favorites.items
    if (favorites !== lastFavorites) {
        lastFavorites = favorites
        saveFavorites(favorites)
    }
})

window.addEventListener('auth:unauthorized', () => {
    clearToken()
    store.dispatch(logout())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
