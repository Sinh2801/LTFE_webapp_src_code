import { configureStore } from '@reduxjs/toolkit'
import { clearToken } from '../libs/tokenStorage'
import authReducer, { logout } from './slices/authSlice'
import cartReducer, { saveCart } from './slices/cartSlice'
import libraryReducer from './slices/librarySlice'
import orderReducer from './slices/orderSlice'
import productReducer from './slices/productSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        products: productReducer,
        orders: orderReducer,
        library: libraryReducer,
    },
})

let lastCartItems = store.getState().cart.items
store.subscribe(() => {
    const items = store.getState().cart.items
    if (items !== lastCartItems) {
        lastCartItems = items
        saveCart(items)
    }
})

window.addEventListener('auth:unauthorized', () => {
    clearToken()
    store.dispatch(logout())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch