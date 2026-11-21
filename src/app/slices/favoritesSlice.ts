import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../libs/types'

const KEY = 'favorite-products'
function loadFavorites(): Product[] {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Product[] } catch { return [] }
}

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: { items: loadFavorites() },
    reducers: {
        toggleFavorite(state, action: PayloadAction<Product>) {
            const exists = state.items.some((item) => item.id === action.payload.id)
            state.items = exists ? state.items.filter((item) => item.id !== action.payload.id) : [...state.items, action.payload]
        },
    },
})

export const { toggleFavorite } = favoritesSlice.actions
export const saveFavorites = (items: Product[]) => {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch {}
}
export default favoritesSlice.reducer
