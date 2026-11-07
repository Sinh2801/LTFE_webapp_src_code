import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {getToken} from '../../libs/tokenStorage'
import type {AuthResponse, User} from '../../libs/types'

interface AuthState {
    user: User | null
    token: string | null
    initialized: boolean
}
const token = getToken()
const initialState: AuthState = {
    user: null,
    token,
    initialized: token === null, // không có token thì không cần chờ
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.initialized = true
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
            state.initialized = true
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.initialized = true
        },
    },
})
export const {loginSuccess, setUser, logout} = authSlice.actions
export default authSlice.reducer