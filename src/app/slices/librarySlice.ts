import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getErrorMessage } from '../../libs/apiClient'
import { libraryService } from '../../libs/services'
import type { LibraryItem } from '../../libs/types'
import { logout } from './authSlice'

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface LibraryState {
    items: LibraryItem[]
    status: RequestStatus
    error: string | null
}

const initialState: LibraryState = { items: [], status: 'idle', error: null }
export const fetchLibrary = createAsyncThunk<LibraryItem[], void, { rejectValue: string }>(
    'library/fetchLibrary',
    async (_, { rejectWithValue }) => {
        try {
            return await libraryService.list()
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

const librarySlice = createSlice({
    name: 'library',
    initialState,
    reducers: {
        loadLibrary: (state, action: PayloadAction<LibraryItem[]>) => {
            state.items = action.payload
        },
        addToLibrary: (state, action: PayloadAction<LibraryItem[]>) => {
            for (const p of action.payload) {
                if (!state.items.some((i) => i.id === p.id)) state.items.push(p)
            }
        },
        recordDownload: (state, action: PayloadAction<string>) => {
            const item = state.items.find((i) => i.id === action.payload)
            if (item) {
                item.downloadCount += 1
                item.lastDownloadedAt = new Date().toISOString()
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout, () => initialState)
            .addCase(fetchLibrary.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchLibrary.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload
            })
            .addCase(fetchLibrary.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload ?? action.error.message ?? 'Không tải được thư viện mã nguồn'
            })
    },
})

export const { loadLibrary, addToLibrary, recordDownload } = librarySlice.actions
export const selectIsOwned =
    (productId: string) =>
        (state: { library: LibraryState }): boolean =>
            state.library.items.some((p) => p.id === productId)

export default librarySlice.reducer