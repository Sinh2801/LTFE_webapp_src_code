const KEY = 'token'

export const getToken = (): string | null => {
    try {
        return localStorage.getItem(KEY)
    } catch {
        return null
    }
}

export const setToken = (token: string): void => {
    try {
        localStorage.setItem(KEY, token)
    } catch {
    }
}

export const clearToken = (): void => {
    try {
        localStorage.removeItem(KEY)
    } catch {
    }
}