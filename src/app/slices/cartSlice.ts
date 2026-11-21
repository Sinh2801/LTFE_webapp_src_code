import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../libs/types'

const STORAGE_KEY = 'cart'

interface CartState {
    items: Product[]
    selectedIdx: string[]
}
function loadFromStorage(): Product[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Product[]
    } catch {
        return []
    }
}
export function saveCart(items: Product[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
    }
}
const initialItems = loadFromStorage()
const initialState: CartState = { items: initialItems, selectedIdx: initialItems.map((p) => p.id) }

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            if (!state.items.some((p) => p.id === action.payload.id)) {
                state.items.push(action.payload)
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((p) => p.id !== action.payload)
        },
        removeManyFromCart: (state, action: PayloadAction<string[]>) => {
            state.items = state.items.filter((p) => !action.payload.includes(p.id))
            state.selectedIdx = state.selectedIdx.filter((id) => !action.payload.includes(id))
        },
        clearCart: (state) => {
            state.items = []
        },
        toggleSelectItem: (state, action: PayloadAction<string>) => {
            const id = action.payload
            if (state.selectedIdx.includes(id)) {
                state.selectedIdx = state.selectedIdx.filter((item) => item !== id)
            } else {
                state.selectedIdx.push(id)
            }
        },
        setSelectedIds: (state, action: PayloadAction<string[]>) => {
            state.selectedIdx = action.payload
        },
    },
})

export const { addToCart, removeFromCart, removeManyFromCart, clearCart, toggleSelectItem, setSelectedIds, } = cartSlice.actions
export const selectCartTotal = (state: { cart: CartState }): number =>
    state.cart.items.reduce((sum, p) => sum + (p.salePrice ?? p.price), 0)
export default cartSlice.reducer