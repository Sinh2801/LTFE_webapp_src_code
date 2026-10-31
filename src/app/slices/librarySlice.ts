import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../libs/types'
import { logout } from './authSlice'

interface LibraryState {
    items: Product[]
}

const initialState: LibraryState = { items: [] }

const librarySlice = createSlice({
    name: 'library',
    initialState,
    reducers: {
        loadLibrary: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload
        },
        addToLibrary: (state, action: PayloadAction<Product[]>) => {
            for (const p of action.payload) {
                if (!state.items.some((i) => i.id === p.id)) state.items.push(p)
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, () => initialState)
    },
})

export const { loadLibrary, addToLibrary } = librarySlice.actions
export const selectIsOwned =
    (productId: string) =>
        (state: { library: LibraryState }): boolean =>
            state.library.items.some((p) => p.id === productId)

export default librarySlice.reducer