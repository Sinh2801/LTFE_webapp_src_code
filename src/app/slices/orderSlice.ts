import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Order, OrderStatus } from '../../libs/types'
import { logout } from './authSlice'

interface OrderState {
    orders: Order[]
}

const initialState: OrderState = { orders: [] }

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        loadOrders: (state, action: PayloadAction<Order[]>) => {
            state.orders = action.payload
        },
        addOrder: (state, action: PayloadAction<Order>) => {
            state.orders.unshift(action.payload)
        },
        updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus }>) => {
            const order = state.orders.find((o) => o.id === action.payload.id)
            if (order) order.status = action.payload.status
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, () => initialState)
    },
})

export const { loadOrders, addOrder, updateOrderStatus } = orderSlice.actions
export default orderSlice.reducer