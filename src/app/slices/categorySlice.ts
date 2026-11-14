import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { catalogService } from '../../libs/services'
import type { Category } from '../../libs/types'
import { getErrorMessage } from '../../libs/apiClient'

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface CategoryState {
    items: Category[]
    status: RequestStatus
    error: string | null
}

const initialState: CategoryState = {
    items: [],
    status: 'idle',
    error: null,
}

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            return await catalogService.categories()
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload ?? action.error.message ?? 'Không tải được danh mục'
            })
    },
})

export default categorySlice.reducer
