import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../libs/types'

interface ProductState {
    featured: Product[]            // sản phẩn noi batj
    latest: Record<string, Product[]> // mới nhất theo danh mục
    list: Product[]                   // danh sách trang
}

const initialState: ProductState = { featured: [], latest: {}, list: [] }

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
})

export const { loadFeatured, loadLatest, loadList } = productSlice.actions
export default productSlice.reducer