import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../libs/types'

const STORAGE_KEY = 'cart'

interface CartState {
    items: Product[]
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
    //      bỏ qua
    }
}

const initialState: CartState = { items: loadFromStorage() }

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
        clearCart: (state) => {
            state.items = []
        },
    },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
// tomng tiền: ưu tiên giá khuyến mãi
export const selectCartTotal = (state: { cart: CartState }): number =>
    state.cart.items.reduce((sum, p) => sum + (p.salePrice ?? p.price), 0)
export default cartSlice.reducer