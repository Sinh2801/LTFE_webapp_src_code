import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import { ApiError, getErrorMessage } from '../../libs/apiClient'
import { authService, userService } from '../../libs/services'
import { clearToken, getToken, setToken } from '../../libs/tokenStorage'
import type { User} from '../../libs/types'

interface AuthState {
    user: User | null
    token: string | null
    initialized: boolean
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}

const savedToken = getToken()
const initialState: AuthState = {
    user: null,
    token: savedToken,
    initialized: savedToken === null,
    status: 'idle',
    error: null,
}

export const restoreSession = createAsyncThunk<User | null>('auth/restoreSession', async () => {
    if (!getToken()) return null
    try {
        return await authService.me()
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) clearToken()
        return null
    }
})

export const loginUser = createAsyncThunk<
    { user: User; token: string },
    { email: string; password: string },
    { rejectValue: string }
>('auth/login', async (body, { rejectWithValue }) => {
    try {
        const data = await authService.login(body)
        setToken(data.access_token)
        return { user: data.user, token: data.access_token }
    } catch (error) {
        return rejectWithValue(getErrorMessage(error))
    }
})

export const registerUser = createAsyncThunk<
    { user: User; token: string },
    { fullName: string; email: string; password: string },
    { rejectValue: string }
>('auth/register', async (body, { rejectWithValue }) => {
    try {
        const data = await authService.register(body)
        setToken(data.access_token)
        return { user: data.user, token: data.access_token }
    } catch (error) {
        return rejectWithValue(getErrorMessage(error))
    }
})

export const updateProfile = createAsyncThunk<User, { fullName: string }, { rejectValue: string }>(
    'auth/updateProfile',
    async (body, { rejectWithValue }) => {
        try {
            return await userService.updateProfile(body)
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

export const changePassword = createAsyncThunk<
    void,
    { currentPassword: string; newPassword: string },
    { rejectValue: string }
>('auth/changePassword', async (body, { rejectWithValue }) => {
    try {
        await userService.changePassword(body)
    } catch (error) {
        return rejectWithValue(getErrorMessage(error))
    }
})


export const signOut = createAsyncThunk('auth/signOut', async (_arg: void, { dispatch }) => {
    try {
        await authService.logout()
    } catch {
    }
    clearToken()
    dispatch(logout())
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.initialized = true
            state.status = 'idle'
            state.error = null
        },
        clearAuthError: (state) => {
            state.error = null
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.user = action.payload
                if (!action.payload) state.token = null
                state.initialized = true
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'idle'
                state.user = action.payload.user
                state.token = action.payload.token
                state.initialized = true
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload ?? 'Đăng nhập thất bại'
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'idle'
                state.user = action.payload.user
                state.token = action.payload.token
                state.initialized = true
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload ?? 'Đăng ký thất bại'
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload
            })
    },
})

export const { logout, clearAuthError, setUser } = authSlice.actions
export default authSlice.reducer