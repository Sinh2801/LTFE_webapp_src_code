import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getErrorMessage } from '../../libs/apiClient'
import { catalogService } from '../../libs/services'
import type { PaginatedResult, Product, ProductQuery } from '../../libs/types'

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface ProductState {
    featured: Product[]
    latest: Record<string, Product[]>
    list: Product[]
    detail: Product | null
    related: Product[]
    pagination: Omit<PaginatedResult<Product>, 'items'>
    featuredStatus: RequestStatus
    listStatus: RequestStatus
    detailStatus: RequestStatus
    relatedStatus: RequestStatus
    error: string | null
}

interface RelatedQuery {
    category: string
    currentProductId: string
}

const initialState: ProductState = {
    featured: [],
    latest: {},
    list: [],
    detail: null,
    related: [],
    pagination: { page: 1, limit: 9, total: 0, totalPages: 0 },
    featuredStatus: 'idle',
    listStatus: 'idle',
    detailStatus: 'idle',
    relatedStatus: 'idle',
    error: null,
}

export const fetchFeatured = createAsyncThunk<Product[], void, { rejectValue: string }>(
    'products/fetchFeatured',
    async (_, { rejectWithValue }) => {
        try {
            const result = await catalogService.products({ featured: true, limit: 6, sort: 'popular' })
            return result.items
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

export const fetchList = createAsyncThunk<PaginatedResult<Product>, ProductQuery, { rejectValue: string }>(
    'products/fetchList',
    async (query, { rejectWithValue }) => {
        try {
            return await catalogService.products(query)
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

export const fetchOne = createAsyncThunk<Product, string, { rejectValue: string }>(
    'products/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            return await catalogService.product(id)
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

export const fetchRelated = createAsyncThunk<
    { currentProductId: string; items: Product[] },
    RelatedQuery,
    { rejectValue: string }
>(
    'products/fetchRelated',
    async ({ category, currentProductId }, { rejectWithValue }) => {
        try {
            const result = await catalogService.products({ category, limit: 5, sort: 'popular' })
            return {
                currentProductId,
                items: result.items.filter((product) => product.id !== currentProductId),
            }
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        loadFeatured: (state, action: PayloadAction<Product[]>) => {
            state.featured = action.payload
        },
        loadLatest: (state, action: PayloadAction<{ category: string; products: Product[] }>) => {
            state.latest[action.payload.category] = action.payload.products
        },
        loadList: (state, action: PayloadAction<Product[]>) => {
            state.list = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeatured.pending, (state) => {
                state.featuredStatus = 'loading'
                state.error = null
            })
            .addCase(fetchFeatured.fulfilled, (state, action) => {
                state.featuredStatus = 'succeeded'
                state.featured = action.payload
            })
            .addCase(fetchFeatured.rejected, (state, action) => {
                state.featuredStatus = 'failed'
                state.error = action.payload ?? action.error.message ?? 'Không tải được sản phẩm nổi bật'
            })
            .addCase(fetchList.pending, (state) => {
                state.listStatus = 'loading'
                state.error = null
            })
            .addCase(fetchList.fulfilled, (state, action) => {
                state.listStatus = 'succeeded'
                state.list = action.payload.items
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    total: action.payload.total,
                    totalPages: action.payload.totalPages,
                }
            })
            .addCase(fetchList.rejected, (state, action) => {
                state.listStatus = 'failed'
                state.error = action.payload ?? action.error.message ?? 'Không tải được danh sách sản phẩm'
            })
            .addCase(fetchOne.pending, (state) => {
                state.detailStatus = 'loading'
                state.detail = null
                state.error = null
            })
            .addCase(fetchOne.fulfilled, (state, action) => {
                state.detailStatus = 'succeeded'
                state.detail = action.payload
            })
            .addCase(fetchOne.rejected, (state, action) => {
                state.detailStatus = 'failed'
                state.error = action.payload ?? action.error.message ?? 'Không tải được sản phẩm'
            })
            .addCase(fetchRelated.pending, (state) => {
                state.relatedStatus = 'loading'
            })
            .addCase(fetchRelated.fulfilled, (state, action) => {
                state.relatedStatus = 'succeeded'
                state.related = action.payload.items
            })
            .addCase(fetchRelated.rejected, (state, action) => {
                state.relatedStatus = 'failed'
                state.error = action.payload ?? action.error.message ?? 'Không tải được sản phẩm liên quan'
            })
    },
})

export const { loadFeatured, loadLatest, loadList } = productSlice.actions
export default productSlice.reducer
