import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getErrorMessage } from '../../libs/apiClient'
import { orderService } from '../../libs/services'
import type { Order, OrderStatus } from '../../libs/types'
import { logout } from './authSlice'
import type { RootState } from '../store'

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface OrderState {
    orders: Order[]
    status: RequestStatus
    error: string | null
}

const initialState: OrderState = { orders: [], status: 'idle', error: null }

export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            return await orderService.list()
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

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
        upsertOrder: (state, action: PayloadAction<Order>) => {
            const index = state.orders.findIndex((o) => o.id === action.payload.id)
            if (index >= 0) state.orders[index] = action.payload
            else state.orders.unshift(action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout, () => initialState)
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.orders = action.payload
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload ?? action.error.message ?? 'Không tải được đơn hàng'
            })
    },
})

export const { loadOrders, addOrder, updateOrderStatus, upsertOrder } = orderSlice.actions
export default orderSlice.reducer
