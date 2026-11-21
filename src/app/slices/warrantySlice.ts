import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getErrorMessage } from '../../libs/apiClient'
import { warrantyService } from '../../libs/services'
import type { WarrantyTicket, WarrantyType } from '../../libs/types'
import { logout } from './authSlice'

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface WarrantyState {
    tickets: WarrantyTicket[]
    status: RequestStatus
    submitting: boolean
    error: string | null
}

const initialState: WarrantyState = { tickets: [], status: 'idle', submitting: false, error: null }

export const fetchTickets = createAsyncThunk<WarrantyTicket[], void, { rejectValue: string }>(
    'warranty/fetchTickets',
    async (_, { rejectWithValue }) => {
        try {
            return await warrantyService.list()
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

export const createTicket = createAsyncThunk<
    WarrantyTicket,
    { productId: string; type: WarrantyType; description: string },
    { rejectValue: string }
>('warranty/createTicket', async (body, { rejectWithValue }) => {
    try {
        return await warrantyService.create(body)
    } catch (error) {
        return rejectWithValue(getErrorMessage(error))
    }
})

const warrantySlice = createSlice({
    name: 'warranty',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(logout, () => initialState)
            .addCase(fetchTickets.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.tickets = action.payload
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload ?? action.error.message ?? 'Không tải được yêu cầu bảo hành'
            })
            .addCase(createTicket.pending, (state) => {
                state.submitting = true
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.submitting = false
                state.tickets.unshift(action.payload)
            })
            .addCase(createTicket.rejected, (state) => {
                state.submitting = false
            })
    },
})

export default warrantySlice.reducer
