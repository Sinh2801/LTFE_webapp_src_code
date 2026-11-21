import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getErrorMessage } from '../../libs/apiClient'
import { catalogService } from '../../libs/services'
import type { Review, ReviewSummary } from '../../libs/types'
import { logout } from './authSlice'

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface ReviewState {
    productId: string | null
    summary: ReviewSummary | null
    status: RequestStatus
    submitting: boolean
    error: string | null
}

const initialState: ReviewState = { productId: null, summary: null, status: 'idle', submitting: false, error: null }

export const fetchReviews = createAsyncThunk<{ productId: string; summary: ReviewSummary }, string, { rejectValue: string }>(
    'reviews/fetchReviews',
    async (productId, { rejectWithValue }) => {
        try {
            return { productId, summary: await catalogService.reviews(productId) }
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

interface ReviewInput {
    productId: string
    rating: number
    comment: string
}

export const submitReview = createAsyncThunk<Review, ReviewInput, { rejectValue: string }>(
    'reviews/submitReview',
    async ({ productId, rating, comment }, { rejectWithValue }) => {
        try {
            return await catalogService.addReview(productId, { rating, comment })
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

export const editReview = createAsyncThunk<Review, { reviewId: string; rating: number; comment: string }, { rejectValue: string }>(
    'reviews/editReview',
    async ({ reviewId, rating, comment }, { rejectWithValue }) => {
        try {
            return await catalogService.updateReview(reviewId, { rating, comment })
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // đăng xuất thì bỏ đánh giá "của tôi" nhưng vẫn giữ danh sách công khai
            .addCase(logout, (state) => {
                if (state.summary) state.summary.mine = null
            })
            .addCase(fetchReviews.pending, (state, action) => {
                if (state.productId !== action.meta.arg) state.summary = null
                state.productId = action.meta.arg
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                if (state.productId !== action.payload.productId) return
                state.status = 'succeeded'
                state.summary = action.payload.summary
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload ?? action.error.message ?? 'Không tải được đánh giá'
            })
            .addCase(submitReview.pending, (state) => {
                state.submitting = true
            })
            .addCase(submitReview.fulfilled, (state) => {
                state.submitting = false
            })
            .addCase(submitReview.rejected, (state) => {
                state.submitting = false
            })
            .addCase(editReview.pending, (state) => {
                state.submitting = true
            })
            .addCase(editReview.fulfilled, (state) => {
                state.submitting = false
            })
            .addCase(editReview.rejected, (state) => {
                state.submitting = false
            })
    },
})

export default reviewSlice.reducer
